# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OLLIM is a voice letter service built with Next.js 16.1.4 and React 19. Users can record voice messages, customize them with fonts/bgm/paper templates, and send them as decorative letters.

## Development Commands

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Start production server (requires build first)
npm start

# Linting
npm run lint

```

## Architecture Overview

### State Management (Dual-Layer Pattern)

**Jotai Atoms** (`/store/`) - UI State:
- `auth.ts`: `accessTokenAtom` (in-memory), `refreshTokenStorage` (sessionStorage)
- `letterAtoms.ts`: `letterIdAtom` (persisted to localStorage via `atomWithStorage`)
- `recordingAtoms.ts`: Recording session state (status, audioBlob, time)

**React Query** - Server State:
- All API calls use `@tanstack/react-query` hooks
- Configuration in `providers/QueryProvider.tsx`: 1min staleTime, 1 retry
- Devtools included for debugging

### API Integration Pattern

All API hooks follow a consistent structure in `/hooks/apis/{method}/`:

```typescript
// Example pattern
export function useGetLetterData(letterId: string) {
  return useQuery({
    queryKey: ["letterData", letterId],
    queryFn: async () => {
      const response = await client.get<ApiResponse<LetterData>>(`/api/letter/${letterId}`);
      return response.data.data;
    },
    enabled: !!letterId,
  });
}
```

- Single axios instance: `lib/axiosInstance.ts` (baseURL from `NEXT_PUBLIC_API_URL`)
- Generic response wrapper: `ApiResponse<T>` type in `/types/api.d.ts`
- Hooks organized by HTTP method: `get/`, `post/`, `patch/`

### Authentication Flow

Multi-layer authentication managed by `providers/AuthProvider.tsx`:

1. **tmpKey Login**: URL query param `tmpKey` → `useGetToken` → tokens stored
2. **Token Refresh**: Auto-renewal via `useTokenRefresh` when accessToken expires
3. **Storage**: accessToken in Jotai atom, refreshToken in sessionStorage
4. **Logout**: Clears both tokens, redirects to login

Check authentication status with `useAtomValue(isLoggedInAtom)`.

### Multi-Step Letter Creation Wizard

Letter creation follows a 4-step flow defined in `/store/lib/letterSteps.ts`:

1. **Record** (`/letter/new/record`) - Voice recording with waveform visualization
2. **Edit** (`/letter/new/edit`) - Letter content editing + voice playback
3. **Analyze** (`/letter/new/analyze`) - Font recommendation based on content
4. **Select** (`/letter/new/select`) - Customize BGM, font, paper template

Helper functions: `getNextStep()`, `getPrevStep()`, `getStepConfig()` for navigation.

### Advanced Audio Recording

The recording system (`hooks/useRecordingSession.ts`) is a complex state machine handling:

- MediaRecorder API with pause/resume support
- WebAudio AnalyserNode for real-time waveform visualization
- Canvas rendering with timeline animation during playback
- iOS AudioContext suspended state cleanup
- 16 useRef hooks managing audio nodes, timers, and canvas contexts

States: `idle` → `recording` → `paused` → `stopped`

Related hooks: `useRecordingTimer`, `useAudioPlayback`, `useWaveformVisualization`, `useBgmPlayer`

## Component Organization

Components are organized by feature, not by type:

```
components/
├── analyze/     # Font recommendation UI
├── edit/        # Letter content editor
├── record/      # Voice recorder with waveform
├── select/      # BGM/font/paper tabs
├── common/      # Shared components (Header, buttons)
├── layout/      # ResponsiveLayout wrapper
└── ui/          # shadcn/ui library components
```

**Container/Presentational Pattern**: Containers manage hooks/state, presentational components handle rendering.

## Styling System

**Tailwind CSS v4** with custom design tokens:

- **Typography**: Custom utilities `typo-h1-*` through `typo-footnote-*` (10 scales)
- **Colors**: Custom theme `primary-50` to `primary-950`
- **Font**: Pretendard variable weight (local font)
- **Component Variants**: CVA (class-variance-authority) for shadcn/ui components
- **Class Merging**: Use `cn()` utility from `lib/utils.ts` (tailwind-merge + clsx)

Example typography usage: `className="typo-h1-bold text-primary-900"`

## Path Aliases

TypeScript path mappings configured in `tsconfig.json`:

```typescript
import Component from "@/components/..."
import { useHook } from "@/hooks/..."
import { atom } from "@/store/..."
import type { Type } from "@/types/..."
```

Available aliases: `@/components`, `@/app`, `@/lib`, `@/hooks`, `@/store`, `@/providers`, `@/types`, `@/public`

## Key Conventions

1. **Client Components**: Mark with `"use client"` directive for interactivity (recording, audio playback, form interactions)
2. **Jotai Patterns**: Use `useAtomValue()` for read-only, `useSetAtom()` for write-only, `useAtom()` for both
3. **Error Handling**: API errors displayed via Sonner toast notifications (configured in root layout)
4. **Remote Images**: AWS S3 bucket pattern configured in `next.config.ts` for Next.js Image optimization

## Adding New Features

1. **New API Endpoint**: Add hook in `/hooks/apis/{method}/`, define type in `/types/`, use useQuery/useMutation
2. **New Global State**: Create atom in `/store/`, consider `atomWithStorage` for persistence
3. **New Component**: Follow feature-based organization, use shadcn/ui patterns for consistency
4. **New Page**: Add to `/app/` with Next.js App Router conventions, reuse layout groups like `(with-home-header)`

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_API_URL=<backend API URL>
```

## Tech Stack Summary

- **Framework**: Next.js 16.1.4 (App Router) + React 19
- **State**: Jotai 2.16.2 (UI) + TanStack Query 5.90.20 (server)
- **Styling**: Tailwind CSS 4 + shadcn/ui + CVA
- **HTTP**: Axios 1.13.3
- **Animation**: Framer Motion 12.29.2
- **Icons**: Lucide React
- **Notifications**: Sonner 2.0.7
- **UI Primitives**: Radix UI (dialog, progress, slot)
- **Dev Tools**: Cypress 14.5.4, ESLint 9
