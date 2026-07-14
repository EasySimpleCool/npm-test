import { useState } from 'react';
import {
  Button,
  CastCard,
  CountdownTimer,
  FilmCard,
  Input,
  MarqueeTicker,
  NavBar,
  SectionContainer,
} from '@easysimplecool/design-system';

const CHARACTERS = [
  {
    name: 'Rex Thunder',
    accent: 'terracotta' as const,
    variant: 'accent-terracotta' as const,
    description:
      'A retired action star who peaked in the 80s and refuses to acknowledge the present tense.',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&q=80',
  },
  {
    name: 'Babs Deluxe',
    accent: 'purple' as const,
    variant: 'accent-purple' as const,
    description:
      'Former soap opera diva turned lifestyle guru with a memoir nobody asked for.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80',
  },
  {
    name: 'The Stunt Guy',
    accent: 'teal' as const,
    variant: 'accent-teal' as const,
    description:
      'Did every fall, flip, and fireball in Hollywood. Still has all his fingers. Mostly.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  },
  {
    name: 'Vincent Noir',
    accent: 'gold' as const,
    variant: 'accent-gold' as const,
    description:
      'Art-house legend who only reads scripts he wrote himself. In iambic pentameter.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
  },
  {
    name: 'Little Suzy',
    accent: 'green' as const,
    variant: 'accent-green' as const,
    description:
      'Child star who outgrew the role but never outgrew the spotlight. Or the pigtails.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80',
  },
];

const FILMS = Array.from({ length: 8 }, (_, i) => ({
  title: `Film ${String(i + 1).padStart(2, '0')}`,
  episode: `Week ${i + 1}`,
  runtime: '12 min',
  thumbnail: `https://picsum.photos/seed/film${i}/400/225`,
}));

const QUIZ_OPTIONS = [
  'I peak in the third act',
  'My best work is behind me',
  'I am the stunt double for my own life',
  'The critics never understood me',
  'I still get recognised at airports',
];

export function App() {
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const premiereDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  return (
    <>
      {/* Hero + Nav */}
      <div className="preview-hero">
        <NavBar
          logo="Second Act"
          links={[
            { label: 'Premiere', href: '#premiere' },
            { label: 'Season', href: '#season' },
            { label: 'Quiz', href: '#quiz' },
            { label: 'Cast', href: '#cast' },
          ]}
          cta={<Button variant="primary">Save my seat</Button>}
          sticky
        />
        <h1 className="preview-hero__title ds-text-display-hero">Second Act</h1>
        <div className="preview-hero__actions">
          <Button variant="primary" size="lg">
            Save my seat
          </Button>
          <Button variant="secondary" size="lg">
            Save me a seat · Thu 6pm
          </Button>
        </div>
      </div>

      <MarqueeTicker text="30 Weeks. 30 Films. One Second Act." />

      {/* Featured film + countdown */}
      <SectionContainer variant="primary" id="premiere">
        <div className="preview-featured">
          <div>
            <p className="preview-section-label">Featured premiere</p>
            <h2 className="preview-featured__film-title ds-text-display-lg">
              The Last Reel
            </h2>
            <p className="preview-subtitle">
              Starring Rex Thunder and Babs Deluxe. A meta-cinematic event you
              will pretend to understand.
            </p>
            <Button variant="ghost">Watch Film 01</Button>
          </div>
          <CountdownTimer targetDate={premiereDate} />
        </div>
      </SectionContainer>

      {/* Character sections */}
      {CHARACTERS.map((character) => (
        <SectionContainer key={character.name} variant={character.variant} id={character.name}>
          <div className="preview-character-grid">
            <div className="preview-character-grid__info">
              <p className="preview-section-label">Character {character.accent}</p>
              <h2 className="ds-text-display-xl">{character.name}</h2>
              <p>{character.description}</p>
              <Button variant="ghost">Watch Film</Button>
            </div>
            <CastCard
              image={character.image}
              name={character.name}
              description={character.description}
              characterTheme={character.accent}
              actions={[
                { label: 'Replace' },
                { label: 'Edit' },
              ]}
            />
          </div>
        </SectionContainer>
      ))}

      {/* Marquee + film reel */}
      <SectionContainer variant="secondary" id="season">
        <p className="preview-section-label">The season</p>
        <h2 className="preview-block-title ds-text-display-md">30 Weeks. 30 Films.</h2>
        <MarqueeTicker text="Now streaming · New film every Thursday · 6pm sharp" speed={25} />
        <div className="preview-reel" style={{ marginTop: 'var(--ds-spacing-xl)' }}>
          {FILMS.map((film, i) => (
            <FilmCard
              key={film.title}
              thumbnail={film.thumbnail}
              title={film.title}
              episode={film.episode}
              runtime={film.runtime}
              accent={CHARACTERS[i % CHARACTERS.length].accent}
            />
          ))}
        </div>
      </SectionContainer>

      {/* Quiz */}
      <SectionContainer variant="tertiary" id="quiz">
        <p className="preview-section-label">Personality quiz</p>
        <h2 className="preview-block-title ds-text-display-lg">Which one are you?</h2>
        <p className="preview-subtitle">
          Select the answer that most closely resembles your relationship with fame.
        </p>
        <div className="preview-quiz-options">
          {QUIZ_OPTIONS.map((option, i) => (
            <Input
              key={option}
              variant="quiz"
              selected={selectedQuiz === i}
              onClick={() => setSelectedQuiz(i)}
            >
              {option}
            </Input>
          ))}
        </div>
      </SectionContainer>

      {/* End credits / cast grid */}
      <SectionContainer variant="primary" id="cast">
        <p className="preview-section-label">End credits</p>
        <h2 className="preview-block-title ds-text-display-lg">End Credits</h2>
        <div className="preview-cast-grid">
          {CHARACTERS.map((character) => (
            <CastCard
              key={character.name}
              image={character.image}
              name={character.name}
              description={character.description}
            />
          ))}
        </div>
      </SectionContainer>

      {/* Component showcase */}
      <SectionContainer variant="secondary">
        <p className="preview-section-label">Component reference</p>
        <h2 className="preview-block-title ds-text-display-sm">All button variants</h2>
        <div className="preview-buttons-row">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="overlay">Overlay</Button>
        </div>
      </SectionContainer>
    </>
  );
}
