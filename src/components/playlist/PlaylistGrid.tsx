import { useState, useEffect, useMemo } from 'react'
import { NETEASE_CONFIG } from '~/config'

interface Song {
  id: string | number
  name: string
  artist: string
  pic?: string
  url?: string
}

function shuffle<T>(array: T[]): T[] {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item)
}

function getSongId(song: Song): string | number {
  if (song.id) return song.id
  if (song.url) {
    const m = song.url.match(/\/(\d+)\.(mp3|flac|m4a)/)
    if (m) return m[1]
  }
  return song.url || song.name
}

const defaultImg = 'https://pic2.zhimg.com/50/v2-cc1a32fcb444fc9d5e23f2ee078dc6e1_720w.jpg?source=1940ef5c'

const SECTION_HEADER_CLASS = 'flex items-center justify-between border-b border-border/40 pb-3 mb-6 select-none'
const SECTION_TITLE_CLASS = 'text-lg font-semibold tracking-tight text-foreground'
const SECTION_NUM_CLASS =
  'inline-flex items-center justify-center rounded-full bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground mr-3'

export default function PlaylistGrid() {
  const [songs, setSongs] = useState<Song[]>([])
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const artist = params.get('artist')?.trim()
    if (artist) setSelectedArtist(artist)
  }, [])

  useEffect(() => {
    async function fetchPlaylist() {
      try {
        const res = await fetch(`${NETEASE_CONFIG.metingApi}/?type=playlist&id=${NETEASE_CONFIG.musicList}`)
        const data: Song[] = await res.json()
        setSongs(data.map((s) => ({ ...s, id: s.id || getSongId(s) })))
      } catch (err) {
        console.error('Failed to fetch playlist:', err)
      }
    }
    fetchPlaylist()
  }, [])

  const allArtists = useMemo(() => {
    const set = new Set<string>()
    songs.forEach((s) => {
      if (s.artist) {
        s.artist
          .split('/')
          .map((a) => a.trim())
          .forEach((a) => set.add(a))
      }
    })
    return shuffle(Array.from(set))
  }, [songs])

  const visibleArtists = useMemo(() => {
    if (NETEASE_CONFIG.musicSlice === 0) return allArtists
    return allArtists.slice(0, NETEASE_CONFIG.musicSlice)
  }, [allArtists])

  const artistSet = useMemo(() => new Set(visibleArtists.map((a) => a.toLowerCase())), [visibleArtists])

  interface GroupedItem {
    artist: string
    song: Song
  }

  const grouped = useMemo(() => {
    const filterLower = selectedArtist?.trim().toLowerCase()
    const processed: GroupedItem[] = []

    songs.forEach((song) => {
      if (!song.artist) return
      const artists = song.artist.split('/').map((a) => a.trim())
      artists.forEach((artist) => {
        const al = artist.toLowerCase()
        if (artistSet.has(al)) {
          if (!filterLower || al === filterLower) {
            processed.push({ artist, song })
          }
        }
      })
    })

    const groups = new Map<string, Song[]>()
    processed.forEach(({ artist, song }) => {
      if (!groups.has(artist)) groups.set(artist, [])
      groups.get(artist)!.push(song)
    })

    return shuffle(
      Array.from(groups.entries()).map(([artist, items]) => ({
        key: artist,
        songs: items,
      }))
    )
  }, [songs, selectedArtist, visibleArtists, artistSet])

  function handleArtistClick(artist: string | null) {
    setSelectedArtist(artist)
    const url = new URL(window.location.href)
    if (artist) url.searchParams.set('artist', artist)
    else url.searchParams.delete('artist')
    window.history.pushState({}, '', url)
  }

  function renderCard(song: Song) {
    return `<a href="${song.url}" target="_self" class="friend-card group flex flex-col justify-between rounded-lg border border-border/40 bg-background/50 p-5 hover:bg-muted/20 hover:border-border hover:shadow-xs transition-all duration-300 hover:-translate-y-0.5">
      <div class="friend-content flex flex-col h-full w-full">
        <div class="flex items-start justify-between mb-3">
          <img src="${song.pic || defaultImg}" alt="${song.name}" class="size-10 rounded-md object-cover ring-1 ring-border/50 bg-muted/30" loading="lazy" />
          <span class="icon-[ph--arrow-up-right] size-4 text-muted-foreground/30 group-hover:text-foreground transition-colors mt-1"></span>
        </div>
        <div class="flex flex-col flex-1">
          <h3 class="font-semibold text-base text-foreground tracking-tight line-clamp-1">${song.name}</h3>
          <div class="text-xs font-medium text-muted-foreground line-clamp-1 mt-0.5">${song.artist}</div>
        </div>
      </div>
    </a>`
  }

  function renderSection(group: { key: string; songs: Song[] }, num: string) {
    const cards = group.songs.map(renderCard).join('')
    return `<div class="mb-24">
      <div class="${SECTION_HEADER_CLASS}">
        <div class="flex items-center">
          <span class="${SECTION_NUM_CLASS}">${num}</span>
          <h2 class="${SECTION_TITLE_CLASS}">${group.key}</h2>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 fade-up animation-delay-200">${cards}</div>
    </div>`
  }

  const sectionsHtml = grouped.map((g, i) => renderSection(g, String(i + 1).padStart(2, '0'))).join('')

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: sectionsHtml }} />
    </div>
  )
}
