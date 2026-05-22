export type ServiceVisualId =
  | 'website'
  | 'design'
  | 'platform'
  | 'dashboard'
  | 'automation'
  | 'finance'
  | 'code'
  | 'support'

export const SERVICE_VISUALS: Record<
  ServiceVisualId,
  { image: string; tag: string; caption: string }
> = {
  website: {
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    tag: 'Веб-страница',
    caption: 'Презентација + форми за контакт и понуда',
  },
  design: {
    image:
      'https://images.unsplash.com/photo-1561070791-2526d30994b4?auto=format&fit=crop&w=800&q=80',
    tag: 'UI / UX',
    caption: 'Прототип пред код — одобрување пред градење',
  },
  platform: {
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    tag: 'Бизнис платформа',
    caption: 'Софтвер за дневна работа на тимот',
  },
  dashboard: {
    image:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80',
    tag: 'Админ панел',
    caption: 'Табели, филтри и извештаи на едно место',
  },
  automation: {
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    tag: 'Автоматизација',
    caption: 'Ако X → системот прави Y',
  },
  finance: {
    image:
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    tag: 'Оперативен систем',
    caption: 'Трансакции, документи, извештаи',
  },
  code: {
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    tag: 'Програмирање',
    caption: 'Нова функција или надградба на постоечко',
  },
  support: {
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    tag: 'После лансирање',
    caption: 'Поддршка од истиот тим што градеше',
  },
}

export const SERVICE_VISUAL_BY_ID: Record<string, ServiceVisualId> = {
  websites: 'website',
  'ui-design': 'design',
  platforms: 'platform',
  admin: 'dashboard',
  automation: 'automation',
  finance: 'finance',
  coding: 'code',
  support: 'support',
}
