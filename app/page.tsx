'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GitFork, Star, AlertCircle, Loader2, ChevronLeft, ChevronRight, Search, X, Moon, Sun } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useTheme } from 'next-themes'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const COLORS = [
  '#8884d8', // Azul
  '#82ca9d', // Verde
  '#ffc658', // Amarelo
  '#ff8042', // Laranja
  '#0088FE', // Azul claro
  '#00C49F', // Verde claro
  '#FFBB28', // Amarelo claro
  '#FF8042', // Laranja escuro
]


// Tipagem para os dados do repositório
interface Repository {
  id: number
  name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  html_url: string
}

// Tipagem para os dados de linguagem no gráfico
interface LanguageData {
  name: string
  value: number
}

// Traduções em diferentes idiomas
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

// Função de busca de repositórios estrelados
async function fetchStarredRepos(): Promise<Repository[]> {
  const { data } = await axios.get<Repository[]>(
    'https://api.github.com/users/mateusarcedev/starred?per_page=100'
  )
  return data
}

export default function Component() {
  const [searchTerm, setSearchTerm] = useState<string>('') // Define o estado como string
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]) // Array de strings para as linguagens selecionadas
  const [language, setLanguage] = useState<'pt-BR' | 'en-US'>('pt-BR') // Linguagens limitadas aos valores disponíveis
  const [currentPage, setCurrentPage] = useState<number>(1) // Estado como número
  const reposPerPage = 10 // Número fixo de repositórios por página
  const { theme, setTheme } = useTheme() // Tema atual e função para alternar tema
  const t = translations[language]

  // Consulta os repositórios usando React Query
  const { data: repos = [], isLoading, isError, error } = useQuery<Repository[], Error>({
    queryKey: ['repos'],
    queryFn: fetchStarredRepos,
    staleTime: 1000 * 60 * 10, // 10 minutos
  })

  // Filtra os repositórios com base na pesquisa e linguagens selecionadas
  const filteredRepos = repos.filter(repo =>
    (repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (selectedLanguages.length === 0 || (repo.language && selectedLanguages.includes(repo.language)))
  )

  const indexOfLastRepo = currentPage * reposPerPage
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage
  const currentRepos = filteredRepos.slice(indexOfFirstRepo, indexOfLastRepo)
  const totalPages = Math.ceil(filteredRepos.length / reposPerPage)

  const uniqueLanguages = Array.from(new Set(repos.map(repo => repo.language).filter(Boolean) as string[]))

  const languageData: LanguageData[] = uniqueLanguages.map(lang => ({
    name: lang,
    value: repos.filter(repo => repo.language === lang).length,
  }))

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language) ? prev.filter(l => l !== language) : [...prev, language]
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-destructive">
        <AlertCircle className="mr-2 h-5 w-5" />
        {error?.message || 'Erro ao carregar repositórios.'}
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
          {uniqueLanguages.map(language => (
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
                  {repo.language && <span className="flex items-center space-x-1"><Badge variant="outline">{repo.language}</Badge></span>}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-muted-foreground">{t.noReposFound}</div>
        )}
      </div>
      <div className="mt-8 flex items-center justify-center space-x-4">
        <Button variant="outline" size="icon" disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm">
          {t.page} {currentPage} {t.of} {totalPages}
        </span>
        <Button variant="outline" size="icon" disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
