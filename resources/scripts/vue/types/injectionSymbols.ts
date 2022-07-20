import type { InjectionKey } from 'vue';
import type { KarthyBot } from '~types/karthyBot';

// App
export const KARTHY_BOT = Symbol('karthyBot') as InjectionKey<KarthyBot>;

// Games: anagram