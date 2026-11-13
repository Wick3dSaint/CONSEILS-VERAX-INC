import { notFound } from 'next/navigation';

// Any /fr/… or /en/… address that isn't a real page shows the translated "page not found".
export const dynamicParams = true;

export default function CatchAll() {
  notFound();
}
