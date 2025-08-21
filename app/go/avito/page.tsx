'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const ANDROID_PACKAGE = 'com.avito.android';

function getUA() {
  if (typeof navigator === 'undefined') return '';
  return navigator.userAgent || '';
}

function isAndroid(ua: string) {
  return /Android/i.test(ua);
}

function isIOS(ua: string) {
  return /iPhone|iPad|iPod/i.test(ua);
}

function isInApp(ua: string) {
  return /(FBAN|FBAV|Instagram|Line|VKClient|VkIntent|OKApp|Viber|WhatsApp|Telegram|MiuiBrowser|TikTok|Twitter)/i.test(ua);
}

function normalizeAvitoURL(raw: string): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:') return null;
    if (!/(\.|^)avito\.ru$/i.test(u.hostname)) return null;
    return u.toString();
  } catch {
    if (/^\/[^^\s]*$/.test(raw)) return `https://avito.ru${raw}`;
    return null;
  }
}

function makeAndroidIntentUrl(webUrl: string) {
  return (
    'intent://' +
    webUrl.replace(/^https?:\/\//i, '') +
    '#Intent;scheme=https;package=' +
    ANDROID_PACKAGE +
    ';S.browser_fallback_url=' +
    encodeURIComponent(webUrl) +
    ';end'
  );
}

function AvitoGoInner() {
  const params = useSearchParams();
  const ua = useMemo(getUA, []);
  const [state, setState] = useState<'init' | 'redirecting' | 'blocked' | 'error'>('init');

  const target = useMemo(() => {
    const raw = params.get('to') || '';
    const decoded = decodeURIComponent(raw);
    return normalizeAvitoURL(decoded);
  }, [params]);

  useEffect(() => {
    if (!target) {
      setState('error');
      return;
    }

    const onAndroid = isAndroid(ua);
    const oniOS = isIOS(ua);
    const inApp = isInApp(ua);

    if (onAndroid) {
      setState('redirecting');
      const intentUrl = makeAndroidIntentUrl(target);
      const t = setTimeout(() => {
        window.location.replace(target);
      }, 1500);
      try {
        window.location.href = intentUrl;
      } catch {
        clearTimeout(t);
        window.location.replace(target);
      }
      return;
    }

    if (oniOS && !inApp) {
      setState('redirecting');
      window.location.replace(target);
      return;
    }

    if (oniOS && inApp) {
      setState('blocked');
      return;
    }

    setState('redirecting');
    window.location.replace(target);
  }, [target, ua]);

  const copy = async () => {
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target);
      alert('Ссылка скопирована');
    } catch {
      // ignore
    }
  };

  if (state === 'error') {
    return (
      <main className="min-h-svh flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border p-6">
          <h1 className="text-xl font-bold mb-2">Неверная ссылка</h1>
          <p className="text-sm opacity-80">
            Параметр <code>to</code> должен указывать на <code>https://avito.ru/…</code>.
          </p>
        </div>
      </main>
    );
  }

  if (state === 'blocked') {
    return (
      <main className="min-h-svh flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border p-6 space-y-4">
          <h1 className="text-xl font-bold">Открыть в приложении Авито</h1>
          <p className="text-sm">
            Вы находитесь во встроенном браузере приложения. Из него ссылка не может открыть приложение Авито напрямую.
          </p>
          <ol className="list-decimal pl-5 text-sm space-y-2">
            <li>Нажмите <span className="font-semibold">⋯</span> или кнопку меню вверху.</li>
            <li>Выберите <span className="font-semibold">Открыть в браузере</span> (Safari/Chrome).</li>
            <li>Перейдите по ссылке ниже — откроется приложение Авито.</li>
          </ol>
          <div className="rounded-lg border p-3 break-all text-xs">{target}</div>
          <div className="flex gap-2">
            <button onClick={copy} className="px-3 py-2 rounded-lg border">Скопировать ссылку</button>
            <a href={target ?? '#'} className="px-3 py-2 rounded-lg border">Открыть веб-версию</a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-svh flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6">
        <h1 className="text-xl font-bold mb-2">Переход…</h1>
        <p className="text-sm opacity-80">Пытаемся открыть приложение Авито.</p>
      </div>
    </main>
  );
}

export default function AvitoGoPage() {
  return (
    <Suspense fallback={
      <main className="min-h-svh flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border p-6">
          <h1 className="text-xl font-bold mb-2">Переход…</h1>
          <p className="text-sm opacity-80">Пытаемся открыть приложение Авито.</p>
        </div>
      </main>
    }>
      <AvitoGoInner />
    </Suspense>
  );
}


