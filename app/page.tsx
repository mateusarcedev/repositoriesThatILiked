'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GitFork, Star, AlertCircle, Loader2, ChevronLeft, ChevronRight, Search, X, Moon, Sun } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useTheme } from 'next-themes'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Repository {
  id: number
  name: string
  description: string
  stargazers_count: number
  forks_count: number
  language: string
  html_url: string
}

interface LanguageData {
  name: string
  value: number
}

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
]

const translations = {
  'pt-BR': {
    title: 'Repositórios que eu gostei',
    search: 'Buscar repositórios...',
    languageDistribution: 'Distribuição de Linguagens',
    languageProportion: 'Proporção de linguagens nos repositórios favoritos',
    noReposFound: 'Nenhum repositório encontrado.',
    noDescription: 'Nenhuma descrição disponível',
    previous: 'Anterior',
    next: 'Próxima',
    page: 'Página',
    of: 'de',
  },
  'en-US': {
    title: 'Repositories I Liked',
    search: 'Search repositories...',
    languageDistribution: 'Language Distribution',
    languageProportion: 'Proportion of languages in favorite repositories',
    noReposFound: 'No repositories found.',
    noDescription: 'No description available',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
  },
}

export default function Component() {
  const [repos, setRepos] = useState<Repository[]>([])
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [languageData, setLanguageData] = useState<LanguageData[]>([])
  const [language, setLanguage] = useState<'pt-BR' | 'en-US'>('pt-BR')
  const { theme, setTheme } = useTheme()
  const t = translations[language]
  const reposPerPage = 10

  useEffect(() => {
    async function fetchStarredRepos() {
      setLoading(true)
      setError('')
      try {
        const response = await fetch('https://api.github.com/users/mateusarcedev/starred?per_page=100')
        if (!response.ok) {
          const errorDetails = await response.json().catch(() => ({}))
          throw new Error(`Erro ao buscar repositórios: ${errorDetails.message || response.statusText}`)
        }

        const data = await response.json()
        setRepos(data)
        setFilteredRepos(data)

        const uniqueLanguages = Array.from(new Set(data.map((repo: Repository) => repo.language).filter(Boolean)))
        setLanguages(uniqueLanguages)

        updateLanguageData(data)
      } catch (err) {
        console.error('Erro no fetchStarredRepos:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar repositórios com estrela.')
      } finally {
        setLoading(false)
      }
    }

    fetchStarredRepos()
  }, [])

  useEffect(() => {
    const results = repos.filter(repo =>
      (repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (selectedLanguages.length === 0 || (repo.language && selectedLanguages.includes(repo.language)))
    )
    setFilteredRepos(results)
    setCurrentPage(1)
    updateLanguageData(results)
  }, [searchTerm, repos, selectedLanguages])

  const updateLanguageData = (repoData: Repository[]) => {
    const langCount: { [key: string]: number } = {}
    repoData.forEach(repo => {
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + 1
      }
    })
    const data = Object.entries(langCount).map(([name, value]) => ({ name, value }))
    data.sort((a, b) => b.value - a.value)
    setLanguageData(data)
  }

  const indexOfLastRepo = currentPage * reposPerPage
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage
  const currentRepos = filteredRepos.slice(indexOfFirstRepo, indexOfLastRepo)
  const totalPages = Math.ceil(filteredRepos.length / reposPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language) ? prev.filter(l => l !== language) : [...prev, language]
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-destructive">
        <AlertCircle className="mr-2 h-5 w-5" />
        {error}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <div className="flex items-center space-x-4">
          <Select value={language} onValueChange={(value: 'pt-BR' | 'en-US') => setLanguage(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt-BR">Português (BR)</SelectItem>
              <SelectItem value="en-US">English (US)</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
      <div className="mb-6 space-y-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {languages.map(language => (
            <Badge
              key={language}
              variant={selectedLanguages.includes(language) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleLanguage(language)}
            >
              {language}
              {selectedLanguages.includes(language) && (
                <X className="ml-1 h-3 w-3" onClick={(e) => {
                  e.stopPropagation()
                  toggleLanguage(language)
                }} />
              )}
            </Badge>
          ))}
        </div>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t.languageDistribution}</CardTitle>
          <CardDescription>{t.languageProportion}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={languageData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        {currentRepos.length > 0 ? (
          currentRepos.map(repo => (
            <Card key={repo.id} className="hover:bg-accent cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {repo.name}
                  </a>
                  <span className="text-xs text-muted-foreground">#{repo.id}</span>
                </CardTitle>
                <CardDescription>{repo.description || t.noDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center space-x-1"><Star className="h-4 w-4" /> {repo.stargazers_count}</span>
                  <span className="flex items-center space-x-1"><GitFork className="h-4 w-4" /> {repo.forks_count}</span>
                  <span>{repo.language}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-muted-foreground">
            {t.noReposFound}
          </div>
        )}
      </div>
      {filteredRepos.length > reposPerPage && (
        <div className="mt-8 flex justify-between items-center">
          <Button variant="outline" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            {t.previous}
          </Button>
          <span className="text-sm">{`${t.page} ${currentPage} ${t.of} ${totalPages}`}</span>
          <Button variant="outline" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
            {t.next}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
