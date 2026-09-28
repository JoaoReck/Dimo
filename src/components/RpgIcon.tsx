import React from 'react';
import { RpgIconId } from '../types';

export interface RpgIconProps {
  icon?: RpgIconId;
  size?: number;
  className?: string;
  variant?: 'default' | 'completed' | 'muted' | 'inverted';
}

export const RPG_ICON_OPTIONS: { id: RpgIconId; label: string; desc: string }[] = [
  { id: 'sword', label: 'Espada', desc: 'Treino & Desafios' },
  { id: 'potion', label: 'Poção', desc: 'Café & Energia' },
  { id: 'book', label: 'Grimório', desc: 'Estudos & Leitura' },
  { id: 'scroll', label: 'Pergaminho', desc: 'Trabalho & Foco' },
  { id: 'campfire', label: 'Fogueira', desc: 'Descanso & Pausa' },
  { id: 'meat', label: 'Banquete', desc: 'Alimentação & Almoço' },
  { id: 'shield', label: 'Escudo', desc: 'Rotina & Finanças' },
  { id: 'torch', label: 'Tocha', desc: 'Início do Dia & Exploração' },
  { id: 'chest', label: 'Baú', desc: 'Tarefas & Compras' },
  { id: 'gem', label: 'Cristal', desc: 'Meta & Foco Profundo' },
];

export function inferRpgIcon(title: string = '', category: string = ''): RpgIconId {
  const t = (title + ' ' + category).toLowerCase();
  if (
    t.includes('trein') ||
    t.includes('acad') ||
    t.includes('exerc') ||
    t.includes('corr') ||
    t.includes('cross') ||
    t.includes('muscul') ||
    t.includes('saúde') ||
    t.includes('saude') ||
    t.includes('físic') ||
    t.includes('fisic') ||
    t.includes('jogar')
  ) {
    return 'sword';
  }
  if (
    t.includes('café') ||
    t.includes('cafe') ||
    t.includes('chá') ||
    t.includes('cha') ||
    t.includes('água') ||
    t.includes('agua') ||
    t.includes('hidra') ||
    t.includes('elixir') ||
    t.includes('poção') ||
    t.includes('pocao')
  ) {
    return 'potion';
  }
  if (
    t.includes('estud') ||
    t.includes('ler') ||
    t.includes('leitur') ||
    t.includes('livro') ||
    t.includes('curs') ||
    t.includes('aula') ||
    t.includes('facul') ||
    t.includes('pesquis')
  ) {
    return 'book';
  }
  if (
    t.includes('almoç') ||
    t.includes('almoc') ||
    t.includes('jant') ||
    t.includes('com') ||
    t.includes('refei') ||
    t.includes('nutri') ||
    t.includes('lanche')
  ) {
    return 'meat';
  }
  if (
    t.includes('dorm') ||
    t.includes('descans') ||
    t.includes('relax') ||
    t.includes('medit') ||
    t.includes('pausa') ||
    t.includes('soneca') ||
    t.includes('sono') ||
    t.includes('recupera')
  ) {
    return 'campfire';
  }
  if (
    t.includes('acord') ||
    t.includes('manhã') ||
    t.includes('manha') ||
    t.includes('despert') ||
    t.includes('caminh') ||
    t.includes('passei') ||
    t.includes('sol')
  ) {
    return 'torch';
  }
  if (
    t.includes('financ') ||
    t.includes('banco') ||
    t.includes('pag') ||
    t.includes('contas') ||
    t.includes('seguran') ||
    t.includes('limpez') ||
    t.includes('casa')
  ) {
    return 'shield';
  }
  if (
    t.includes('compr') ||
    t.includes('mercad') ||
    t.includes('shop') ||
    t.includes('loja') ||
    t.includes('invent') ||
    t.includes('caixa')
  ) {
    return 'chest';
  }
  if (
    t.includes('meta') ||
    t.includes('foco') ||
    t.includes('deep') ||
    t.includes('priorid') ||
    t.includes('conquist') ||
    t.includes('importan')
  ) {
    return 'gem';
  }
  return 'scroll';
}

/**
 * Handcrafted Pixel Art / RPG Item Icons
 * Rendered as crisp vector paths with pixel-grid geometry (24x24 viewBox)
 * Adapted to Dimo's Baunilha + Carvão palette with controlled RPG accents
 */
export const RpgIcon: React.FC<RpgIconProps> = ({
  icon = 'scroll',
  size = 24,
  className = '',
  variant = 'default',
}) => {
  const isCompleted = variant === 'completed';
  const isMuted = variant === 'muted';
  const isInverted = variant === 'inverted';

  // Base palette bindings
  const strokeColor = isCompleted || isInverted ? '#EDE8D0' : isMuted ? '#9D9988' : '#141410';
  const bladeFill = isCompleted || isInverted ? '#C4C0AB' : isMuted ? '#FAF8F0' : '#EDE8D0';
  const accentRed = isCompleted || isInverted ? '#EDE8D0' : '#B83A3A';
  const accentGold = isCompleted || isInverted ? '#C4C0AB' : '#D4A359';
  const woodBrown = isCompleted || isInverted ? '#9D9988' : '#545248';
  const potionLiquid = isCompleted || isInverted ? '#EDE8D0' : '#777567';

  const renderIconContent = () => {
    switch (icon) {
      /* 1. ESPADA (Treino, superação - inspirada na icone4 / icone2) */
      case 'sword':
        return (
          <g>
            {/* Blade body at 45 degree angle */}
            <path
              d="M17 3 L21 7 L11 17 L8 18 L7 17 L8 14 Z"
              fill={bladeFill}
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Fuller groove */}
            <line
              x1="18"
              y1="6"
              x2="11"
              y2="13"
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Crossguard with distinct wings */}
            <path
              d="M7 13 L13 19 L11 21 L5 15 Z"
              fill={woodBrown}
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Central cross medallion jewel (reference icone4) */}
            <rect
              x="8.5"
              y="15.5"
              width="2"
              height="2"
              fill={accentRed}
            />
            {/* Hilt grip */}
            <line
              x1="8"
              y1="18"
              x2="4"
              y2="22"
              stroke={woodBrown}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Golden grip rings */}
            <circle cx="6" cy="20" r="0.8" fill={accentGold} />
            {/* Round pommel */}
            <circle
              cx="3"
              cy="23"
              r="1.6"
              fill={bladeFill}
              stroke={strokeColor}
              strokeWidth="1.2"
            />
          </g>
        );

      /* 2. POÇÃO (Café, elixir, energia) */
      case 'potion':
        return (
          <g>
            {/* Cork stopper */}
            <rect
              x="10.5"
              y="3"
              width="3"
              height="2.5"
              rx="0.5"
              fill={woodBrown}
              stroke={strokeColor}
              strokeWidth="1.2"
            />
            {/* Flask neck */}
            <path
              d="M10 5.5 H14 V8 L17 12 C18.5 14 18.5 17.5 16.5 19.5 C14.5 21.5 9.5 21.5 7.5 19.5 C5.5 17.5 5.5 14 7 12 L10 8 Z"
              fill={bladeFill}
              stroke={strokeColor}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Liquid inside (Coffee brew / Elixir) */}
            <path
              d="M7.5 14 C9 13.5 15 13.5 16.5 14 C17.5 16 17 18.5 15.5 19.5 C13.5 20.8 10.5 20.8 8.5 19.5 C7 18.5 6.5 16 7.5 14 Z"
              fill={potionLiquid}
            />
            {/* Specular shine highlight */}
            <path
              d="M8.5 13 L9.5 11 L10 11.5"
              stroke={isCompleted || isInverted ? '#141410' : '#FAF8F0'}
              strokeWidth="1"
              strokeLinecap="round"
            />
            {/* Rising micro bubble */}
            <circle cx="13" cy="16.5" r="0.8" fill={isCompleted || isInverted ? '#141410' : '#FAF8F0'} />
          </g>
        );

      /* 3. GRIMÓRIO / LIVRO (Estudo, leitura) */
      case 'book':
        return (
          <g>
            {/* Book cover back */}
            <rect
              x="5"
              y="4"
              width="14"
              height="16"
              rx="1.5"
              fill={bladeFill}
              stroke={strokeColor}
              strokeWidth="1.4"
            />
            {/* Spine */}
            <rect
              x="5"
              y="4"
              width="3.5"
              height="16"
              rx="1"
              fill={woodBrown}
              stroke={strokeColor}
              strokeWidth="1.2"
            />
            {/* Bookmark ribbon hanging out bottom */}
            <path
              d="M12 18 V22 L13.5 21 L15 22 V18 Z"
              fill={accentRed}
              stroke={strokeColor}
              strokeWidth="0.8"
            />
            {/* Rune / emblem on cover */}
            <circle
              cx="13"
              cy="11"
              r="2.2"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.2"
            />
            <line x1="13" y1="9" x2="13" y2="13" stroke={strokeColor} strokeWidth="1" />
            <line x1="11" y1="11" x2="15" y2="11" stroke={strokeColor} strokeWidth="1" />
            {/* Metal corner bracket */}
            <path d="M16 4 H18 V6" stroke={accentGold} strokeWidth="1.2" />
            <path d="M16 20 H18 V18" stroke={accentGold} strokeWidth="1.2" />
          </g>
        );

      /* 4. PERGAMINHO (Trabalho, projetos, contrato) */
      case 'scroll':
        return (
          <g>
            {/* Main rolled parchment body */}
            <path
              d="M6 7 C6 5.5 8 5.5 10 5.5 H17 C19 5.5 19 7 19 8.5 V17 C19 18.5 17 18.5 15 18.5 H8 C6 18.5 6 17 6 15.5 Z"
              fill={bladeFill}
              stroke={strokeColor}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Top roll curl */}
            <ellipse
              cx="17"
              cy="7"
              rx="2"
              ry="1.5"
              fill={woodBrown}
              stroke={strokeColor}
              strokeWidth="1"
            />
            {/* Bottom roll curl */}
            <ellipse
              cx="8"
              cy="17"
              rx="2"
              ry="1.5"
              fill={woodBrown}
              stroke={strokeColor}
              strokeWidth="1"
            />
            {/* Script lines */}
            <line x1="9" y1="9" x2="15" y2="9" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
            <line x1="9" y1="12" x2="14" y2="12" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
            {/* Red wax seal stamp */}
            <circle cx="15.5" cy="14.5" r="1.8" fill={accentRed} stroke={strokeColor} strokeWidth="0.8" />
          </g>
        );

      /* 5. FOGUEIRA (Descanso, relaxamento, recuperação) */
      case 'campfire':
        return (
          <g>
            {/* Crossed campfire logs */}
            <line x1="5" y1="19" x2="19" y2="19" stroke={woodBrown} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="6" y1="21" x2="18" y2="17" stroke={woodBrown} strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="21" x2="6" y2="17" stroke={woodBrown} strokeWidth="2" strokeLinecap="round" />
            {/* Outer flame */}
            <path
              d="M12 4 C14 8 18 10 16 16 C15 18 13.5 19 12 19 C10.5 19 9 18 8 16 C6 10 10 8 12 4 Z"
              fill={accentRed}
              stroke={strokeColor}
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            {/* Inner glowing flame heart */}
            <path
              d="M12 9 C13 11 15 13 14 16 C13.5 17 12.8 17.5 12 17.5 C11.2 17.5 10.5 17 10 16 C9 13 11 11 12 9 Z"
              fill={accentGold}
            />
            {/* Floating ember spark */}
            <circle cx="14" cy="4" r="0.8" fill={accentGold} />
          </g>
        );

      /* 6. BANQUETE / CARNE (Almoço, refeição, nutrição) */
      case 'meat':
        return (
          <g>
            {/* Roasted meat body */}
            <ellipse
              cx="13"
              cy="11"
              rx="6"
              ry="5"
              transform="rotate(-20 13 11)"
              fill={woodBrown}
              stroke={strokeColor}
              strokeWidth="1.4"
            />
            {/* Golden savory crust patch */}
            <ellipse
              cx="13.5"
              cy="10"
              rx="4"
              ry="3"
              transform="rotate(-20 13.5 10)"
              fill={accentGold}
            />
            {/* Bone protruding from shank */}
            <line
              x1="8"
              y1="14"
              x2="4"
              y2="18"
              stroke={bladeFill}
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            {/* Bone double-knob joint */}
            <circle cx="3.5" cy="17.5" r="1.5" fill={bladeFill} stroke={strokeColor} strokeWidth="1" />
            <circle cx="5" cy="19" r="1.5" fill={bladeFill} stroke={strokeColor} strokeWidth="1" />
          </g>
        );

      /* 7. ESCUDO (Rotina, finanças, segurança) */
      case 'shield':
        return (
          <g>
            {/* Kite shield body */}
            <path
              d="M6 5 H18 V12 C18 16.5 12 21 12 21 C12 21 6 16.5 6 12 Z"
              fill={bladeFill}
              stroke={strokeColor}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Steel rim bevel */}
            <path
              d="M8 7 H16 V12 C16 15 12 18.5 12 18.5 C12 18.5 8 15 8 12 Z"
              fill={woodBrown}
              stroke={strokeColor}
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Heraldic heraldry cross */}
            <line x1="12" y1="8" x2="12" y2="16" stroke={accentGold} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="9.5" y1="11" x2="14.5" y2="11" stroke={accentGold} strokeWidth="1.5" strokeLinecap="round" />
            {/* Rivet studs */}
            <circle cx="7.5" cy="6.5" r="0.6" fill={strokeColor} />
            <circle cx="16.5" cy="6.5" r="0.6" fill={strokeColor} />
          </g>
        );

      /* 8. TOCHA (Início do dia, clareza, exploração - inspirada na referencia-players2) */
      case 'torch':
        return (
          <g>
            {/* Wooden torch haft */}
            <line
              x1="9"
              y1="19"
              x2="15"
              y2="10"
              stroke={woodBrown}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Linen grip wrap */}
            <line x1="10.5" y1="16.5" x2="12.5" y2="14" stroke={accentGold} strokeWidth="2.2" />
            {/* Torch head iron basket */}
            <rect
              x="13.5"
              y="8"
              width="4"
              height="3"
              rx="0.5"
              fill={woodBrown}
              stroke={strokeColor}
              strokeWidth="1.2"
            />
            {/* Blazing torch fire (as seen on the adventurer in reference image) */}
            <path
              d="M15 3 C17 5 19 6 18 9 C17 11 14 11 13 9 C12 7 14 5 15 3 Z"
              fill={accentRed}
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Inner flame core */}
            <circle cx="15.5" cy="7.5" r="1.5" fill={accentGold} />
          </g>
        );

      /* 9. BAÚ (Tarefas, compras, inventário) */
      case 'chest':
        return (
          <g>
            {/* Chest base body */}
            <rect
              x="4.5"
              y="10.5"
              width="15"
              height="9.5"
              rx="1"
              fill={woodBrown}
              stroke={strokeColor}
              strokeWidth="1.4"
            />
            {/* Chest curved lid */}
            <path
              d="M4.5 10.5 C4.5 7 7 5.5 12 5.5 C17 5.5 19.5 7 19.5 10.5 Z"
              fill={woodBrown}
              stroke={strokeColor}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Brass reinforcing strap bands */}
            <rect x="7.5" y="6" width="2" height="14" fill={accentGold} />
            <rect x="14.5" y="6" width="2" height="14" fill={accentGold} />
            {/* Center keyhole latch lock */}
            <rect
              x="10.5"
              y="9.5"
              width="3"
              height="3"
              rx="0.5"
              fill={bladeFill}
              stroke={strokeColor}
              strokeWidth="1"
            />
            <circle cx="12" cy="10.8" r="0.6" fill={strokeColor} />
            <line x1="12" y1="11" x2="12" y2="12" stroke={strokeColor} strokeWidth="0.8" />
          </g>
        );

      /* 10. CRISTAL / GEMA (Foco profundo, meta crucial, conquista) */
      case 'gem':
        return (
          <g>
            {/* Faceted diamond/gem silhouette */}
            <path
              d="M7 8 L12 3 L17 8 L12 21 Z"
              fill={bladeFill}
              stroke={strokeColor}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Facet lines */}
            <line x1="7" y1="8" x2="17" y2="8" stroke={strokeColor} strokeWidth="1" />
            <line x1="12" y1="3" x2="12" y2="21" stroke={strokeColor} strokeWidth="1" />
            <path d="M9.5 5.5 L12 8 L14.5 5.5" stroke={strokeColor} strokeWidth="1" fill="none" />
            <line x1="12" y1="8" x2="9" y2="14" stroke={strokeColor} strokeWidth="0.8" />
            <line x1="12" y1="8" x2="15" y2="14" stroke={strokeColor} strokeWidth="0.8" />
            {/* Gleam sparkle */}
            <circle cx="10" cy="7" r="0.8" fill={isCompleted || isInverted ? '#141410' : '#FAF8F0'} />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 select-none ${className}`}
      style={{
        imageRendering: 'pixelated',
        shapeRendering: 'geometricPrecision',
      }}
      aria-hidden="true"
    >
      {renderIconContent()}
    </svg>
  );
};
