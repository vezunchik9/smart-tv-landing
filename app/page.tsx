'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Rocket, Star, MessageCircle, ShieldCheck, RotateCcw, CheckCircle2, PlayCircle, Clock3, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SmartTVLanding() {
  const AVITO_PROFILE_WEB = 'https://www.avito.ru/user/9cfd9702f583d24b1fbba2b54b5f8c73/profile';
  const AVITO_ANDROID_PACKAGE = 'ru.avito';
  const AVITO_IOS_APP_STORE = 'https://apps.apple.com/ru/app/avito-%D0%BE%D0%B1%D1%8A%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F/id417281773';
  const AVITO_ANDROID_PLAY = 'https://play.google.com/store/apps/details?id=ru.avito';
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+7 (');
  const [model, setModel] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isAdvertiserInfoOpen, setIsAdvertiserInfoOpen] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');

    if (raw.startsWith('7')) raw = raw.slice(1);
    let formatted = '+7 (';
    if (raw.length > 0) formatted += raw.substring(0, 3);
    if (raw.length >= 4) formatted += `) ${raw.substring(3, 6)}`;
    if (raw.length >= 7) formatted += `-${raw.substring(6, 8)}`;
    if (raw.length >= 9) formatted += `-${raw.substring(8, 10)}`;

    setPhone(formatted);
  };

  const openAvito = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const ua = navigator.userAgent || navigator.vendor;
    const isAndroid = /android/i.test(ua);
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    if (isAndroid) {
      const intent = `intent://user/9cfd9702f583d24b1fbba2b54b5f8c73/profile#Intent;scheme=https;package=${AVITO_ANDROID_PACKAGE};S.browser_fallback_url=${encodeURIComponent(AVITO_PROFILE_WEB)};end`;
      window.location.href = intent;
      setTimeout(() => {
        window.location.href = AVITO_ANDROID_PLAY;
      }, 1200);
      return;
    }
    if (isIOS) {
      // Universal link: iOS откроет приложение, если установлено; иначе останется в браузере.
      window.location.href = AVITO_PROFILE_WEB;
      setTimeout(() => {
        window.location.href = AVITO_IOS_APP_STORE;
      }, 1200);
      return;
    }
    window.open(AVITO_PROFILE_WEB, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validName = name.trim() !== '';
    const validPhone = phone.replace(/\D/g, '').length === 11;
    
    setErrorName(!validName);
    setErrorPhone(!validPhone);
    if (!validName || !validPhone || !agreed) return;

    setLoading(true);
    try {
      await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, model }),
      });
      setSuccess(true);
      setName('');
      setPhone('+7 (');
      setModel('');
    } catch {
      alert('Ошибка отправки. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const sectionAnim = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true },
  } as const;

  const Review = ({ img, name, text }: { img: string; name: string; text: string }) => (
    <Card>
      <CardContent className="flex gap-4 items-start p-6 bg-white rounded-xl shadow-md">
        <img src={img} alt={name} className="inline-block w-12 h-12 rounded-full object-cover aspect-square shrink-0" />
        <div>
          <p className="text-base font-semibold">{name}</p>
          <p className="text-yellow-400 text-sm" aria-label="5 из 5">⭐⭐⭐⭐⭐</p>
          <p className="text-sm mt-1 text-gray-700 leading-snug">{text}</p>
        </div>
      </CardContent>
    </Card>
  );

  const MiniForm = ({ defaultCategory }: { defaultCategory: string }) => {
    const [miniName, setMiniName] = useState('');
    const [miniPhone, setMiniPhone] = useState('+7 (');
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [errorMiniName, setErrorMiniName] = useState(false);
    const [errorMiniPhone, setErrorMiniPhone] = useState(false);

    const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let raw = e.target.value.replace(/\D/g, '');
      if (raw.startsWith('7')) raw = raw.slice(1);
      let formatted = '+7 (';
      if (raw.length > 0) formatted += raw.substring(0, 3);
      if (raw.length >= 4) formatted += `) ${raw.substring(3, 6)}`;
      if (raw.length >= 7) formatted += `-${raw.substring(6, 8)}`;
      if (raw.length >= 9) formatted += `-${raw.substring(8, 10)}`;
      setMiniPhone(formatted);
    };

    const onSubmitMini = async (e: React.FormEvent) => {
      e.preventDefault();
      const validName = miniName.trim() !== '';
      const validPhone = miniPhone.replace(/\D/g, '').length === 11;
      setErrorMiniName(!validName);
      setErrorMiniPhone(!validPhone);
      if (!validName || !validPhone) return;
      setSending(true);
      try {
        await fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: miniName, phone: miniPhone, model: '', category: defaultCategory }),
        });
        setSent(true);
        setMiniName('');
        setMiniPhone('+7 (');
      } catch {
        alert('Ошибка отправки. Попробуйте позже.');
      } finally {
        setSending(false);
      }
    };

    return (
      <form onSubmit={onSubmitMini} className="space-y-2 text-left">
        <p className="text-xs text-gray-600">Хочу настроить: <span className="font-medium">{defaultCategory}</span></p>
        <Input
          type="text"
          placeholder="Ваше имя"
          value={miniName}
          onChange={(e) => setMiniName(e.target.value)}
          className={cn('w-full', errorMiniName ? 'border border-red-500' : '')}
          aria-invalid={errorMiniName}
        />
        <Input
          type="tel"
          placeholder="Номер телефона"
          value={miniPhone}
          onChange={onPhoneChange}
          className={cn('w-full', errorMiniPhone ? 'border border-red-500' : '')}
          aria-invalid={errorMiniPhone}
        />
        <Button type="submit" disabled={sending} className="w-full bg-gradient-to-r from-green-400 to-lime-500 text-white rounded-full px-4 py-2 text-sm transition-all duration-200">
          {sending ? 'Отправка...' : 'Узнать возможность'}
        </Button>
        <p className="text-[11px] text-gray-500">Отправляя заявку, вы соглашаетесь с <a href="#" className="underline">политикой конфиденциальности</a></p>
        {sent && (
          <div className="text-green-600 text-sm">✅ Заявка отправлена!</div>
        )}
      </form>
    );
  };

  return (
    <div className="font-sans bg-white text-gray-900 relative">
      {/* Шапка с исправленной кнопкой CTA */}
      <header className="text-center py-12 px-4 bg-gradient-to-br from-blue-700 to-indigo-800 text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">Настроим Smart TV за 20 минут — без подписок</h1>
        <p className="text-base md:text-lg opacity-90 mb-6 max-w-3xl mx-auto">
          AnyDesk подключение, ≈23 минуты, оплата только после результата. Подключаем YouTube и 1000+ каналов.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#contact">
            <Button className="bg-gradient-to-r from-green-400 to-lime-500 hover:from-green-500 hover:to-lime-600 text-white text-base sm:text-lg px-5 py-3 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center gap-2">
              <Rocket className="size-5" />
              Начать бесплатно
            </Button>
          </a>
          <a href="https://wa.me/79991007585" target="_blank" rel="noopener noreferrer">
            <Button className="bg-white text-blue-700 hover:bg-white/90 text-base sm:text-lg px-5 py-3 rounded-full transition-all duration-200 flex items-center gap-2">
              <MessageCircle className="size-5" />
              Написать в WhatsApp
            </Button>
          </a>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3 text-sm opacity-95">
          <span className="text-xl font-bold">5,0</span>
          <span className="text-yellow-400" aria-label="5 из 5">★★★★★</span>
          <a href={`/go/avito?to=${encodeURIComponent(AVITO_PROFILE_WEB)}`} className="text-blue-500 hover:underline">239 отзывов</a>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-white/90">
          <div className="flex items-center gap-2"><RotateCcw className="size-4" /><span>Если не получилось — ничего не платите</span></div>
          <div className="flex items-center gap-2"><ShieldCheck className="size-4" /><span>Гарантия 7 дней — бесплатно восстановим</span></div>
        </div>
      </header>

      <motion.section {...sectionAnim} className="py-8 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm border">
            <CheckCircle2 className="text-green-600 shrink-0" size={22} />
            <span className="text-base md:text-lg">Без подписок</span>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm border">
            <PlayCircle className="text-blue-600 shrink-0" size={22} />
            <span className="text-base md:text-lg">YouTube и 1000+ каналов</span>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm border">
            <Clock3 className="text-amber-600 shrink-0" size={22} />
            <span className="text-base md:text-lg">Удалённая настройка · 20–30 мин</span>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm border">
            <BadgeCheck className="text-indigo-600 shrink-0" size={22} />
            <span className="text-base md:text-lg">Оплата после результата</span>
          </div>
        </div>
      </motion.section>

      {/* Пример процесса настройки (слайдер на мобилках) */}
      <motion.section {...sectionAnim} className="py-10 px-4 max-w-6xl mx-auto">
        <h3 className="text-xl font-semibold text-center mb-6">Пример процесса настройки</h3>
        <div
          className="flex sm:grid sm:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none -mx-4 px-4 py-2"
          aria-label="Скриншоты процесса настройки"
        >
          {[
            { src: '/nastroyka/nastroyka1.png', alt: 'Процесс настройки 1' },
            { src: '/nastroyka/nastroyka2.png', alt: 'Процесс настройки 2' },
            { src: '/nastroyka/nastroyka3.png', alt: 'Процесс настройки 3' },
          ].map((img) => (
            <div key={img.src} className="flex-none w-[85%] sm:w-auto snap-center">
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-56 sm:h-64 object-cover rounded-xl shadow-md"
              />
            </div>
          ))}
        </div>
      </motion.section>

      {/* Блок тарифов */}
      <motion.section {...sectionAnim} className="py-10 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Выберите оптимальный пакет</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              title: 'Кинотеатр', 
              price: '599 ₽',
              feature: '3+ кинотеатра — новинки быстро добавляются'
            },
            { 
              title: 'Каналы', 
              price: '599 ₽',
              feature: '1000+ каналов: спорт, новости, детские, кино, развлекательные и др.'
            },
            { 
              title: 'Всё вместе', 
              price: '1 000 ₽',
              feature: 'Пакет: Кинотеатр + Каналы + рабочий YouTube',
              highlight: true
            },
          ].map(({ title, price, feature, highlight }) => (
            <Card key={title} className={highlight ? "border-2 border-green-400 relative shadow-lg" : ""}>
              {highlight && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  ВЫГОДНО
                </div>
              )}
              <CardContent className="p-6 text-center space-y-4">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-lg font-bold">{price}</p>
                <p className="text-sm text-gray-600 min-h-[40px]">{feature}</p>
                <MiniForm defaultCategory={title} />
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Улучшенный блок процесса с пояснениями */}
      <motion.section {...sectionAnim} className="py-10 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Как проходит подключение?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { 
              step: "1. Заявка", 
              icon: "📩",
              desc: "Заполняете форму за 1 минуту" 
            },
            { 
              step: "2. Связь", 
              icon: "💬",
              desc: "Пишем в WhatsApp или Telegram" 
            },
            { 
              step: "3. Настройка", 
              icon: "🧑‍💻",
              desc: "Удалённо через AnyDesk, вы всё подтверждаете" 
            },
            { 
              step: "4. Оплата", 
              icon: "💳",
              desc: "Только после результата" 
            }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="font-semibold mb-1">{item.step}</div>
              <div className="text-sm text-gray-600">{item.desc}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Блок совместимости — фото вместо иконок */}
      <motion.section {...sectionAnim} className="py-10 px-4 text-center bg-gray-100">
        <h2 className="text-2xl font-semibold mb-3">Совместимо с большинством Smart TV</h2>
        <p className="text-sm text-gray-600 mb-6">если у вас такой или похожий экран тв значит он подлежит настройке</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-5xl mx-auto">
          <img
            src="/sovmestim/google_tv_home-750x433.jpg"
            alt="Google TV экран"
            loading="lazy"
            className="w-full h-56 sm:h-64 md:h-72 object-cover rounded-xl shadow-md"
          />
          <img
            src="/sovmestim/smart.jpg"
            alt="Android TV экран"
            loading="lazy"
            className="w-full h-56 sm:h-64 md:h-72 object-cover rounded-xl shadow-md"
          />
        </div>
      </motion.section>

      {/* Блок о мастере с фото (две колонки на десктопе) */}
      <motion.section {...sectionAnim} className="py-12 px-4 max-w-5xl mx-auto text-gray-800">
        <div className="bg-blue-50 p-8 md:p-10 rounded-2xl grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          <div className="md:col-span-2">
            <img
              src="/master/maksim.jpg"
              alt="Мастер Максим"
              className="w-full h-56 sm:h-64 md:h-[280px] object-cover rounded-2xl shadow-md"
              loading="lazy"
            />
          </div>
          <div className="md:col-span-3 text-base md:text-lg leading-relaxed md:leading-8 text-center md:text-left">
            <p><strong>Мастер Максим.</strong> Настраиваю Smart TV и приставки удалённо с 2015 года. Оплата только после результата — меня рекомендуют друзьям.</p>
            <div className="mt-4 flex justify-center md:justify-start">
              <a href="https://wa.me/79991007585" target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#25D366] hover:bg-[#20bd59] text-white rounded-full px-5 py-2.5 flex items-center gap-2 text-base font-medium">
                  <MessageCircle className="size-5" />
                  Написать Максиму
                </Button>
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Блок отзывов: слайдер на мобилках, 3 в ряд на десктопе */}
      <motion.section id="reviews" {...sectionAnim} className="py-10 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Отзывы</h2>
        <p className="text-center text-gray-700 font-medium mb-6">
          Читайте отзывы на
          {' '}
          <a href={`/go/avito?to=${encodeURIComponent(AVITO_PROFILE_WEB)}`} className="text-blue-600 underline">Avito</a>
        </p>

        <div
          className="flex sm:grid sm:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none -mx-4 px-4 py-2"
          aria-label="Скриншоты отзывов клиентов"
        >
          {[
            { src: '/otzav/otzav1.png', alt: 'Скрин отзыва 1' },
            { src: '/otzav/otzav2.png', alt: 'Скрин отзыва 2' },
            { src: '/otzav/otzav3.png', alt: 'Скрин отзыва 3' },
          ].map((img) => (
            <div key={img.src} className="flex-none w-[85%] sm:w-auto snap-center">
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-64 md:h-72 object-cover rounded-xl shadow-md"
              />
            </div>
          ))}
        </div>
      </motion.section>

      {/* Улучшенная форма захвата с нижним отступом */}
      <motion.section 
        id="contact" 
        {...sectionAnim} 
        className="py-12 px-4 max-w-3xl mx-auto pb-[80px] md:pb-12"
      >
        <div className="text-center bg-blue-50 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-2">Оставьте заявку — и начните смотреть сегодня</h2>
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              ✅ Заявка отправлена! Мы свяжемся с вами в течение 5 минут.
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full ${errorName ? 'border border-red-500' : ''}`}
              aria-invalid={errorName}
            />
            <Input
              type="tel"
              placeholder="Телефон"
              value={phone}
              onChange={handlePhoneChange}
              className={`w-full ${errorPhone ? 'border border-red-500' : ''}`}
              aria-invalid={errorPhone}
            />
            <Input
              placeholder="Модель ТВ (если знаете)"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full"
            />
            
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreement"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 mr-2"
              />
              <label htmlFor="agreement" className="text-sm text-gray-700 text-left">
                Соглашаюсь с обработкой данных и <a href="#" className="text-blue-600 underline">политикой конфиденциальности</a>
              </label>
            </div>
            
            <Button 
              type="submit" 
              disabled={loading || !agreed}
              className="w-full bg-gradient-to-r from-green-400 to-lime-500 text-white text-lg rounded-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg py-6"
            >
              {loading ? 'Отправка...' : (
                <>
                  <span className="mr-2">🚀</span>
                  <span>До результата — бесплатно</span>
                </>
              )}
            </Button>
          </form>
          
          <p className="mt-4 text-sm text-gray-600">
            Свяжемся в течение 5 минут в мессенджере. Никаких звонков.
          </p>
        </div>
      </motion.section>

      {/* Футер с нижним отступом */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t mt-10 pb-[80px] md:pb-6">
        © 2025 SmartTV Connect | <a href="#" className="text-blue-600 underline">Политика конфиденциальности</a>
        <span className="mx-2 text-gray-300">|</span>
        <button
          type="button"
          onClick={() => setIsAdvertiserInfoOpen(true)}
          className="text-gray-400 hover:text-gray-600 underline-offset-4 hover:underline"
        >
          Информация о рекламодателе
        </button>
      </footer>

      {/* Плавающая кнопка с z-index */}
      <a href="#contact" className="fixed bottom-4 right-4 z-50 block md:hidden">
        <Button className="bg-gradient-to-r from-green-400 to-lime-500 text-white rounded-full px-5 py-3 shadow-xl hover:shadow-lg transition-all duration-200">
          🚀 Записаться
        </Button>
      </a>

      {isAdvertiserInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsAdvertiserInfoOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-[92vw] max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Информация о рекламодателе</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div><span className="text-gray-500">ФИО:</span> —</div>
              <div><span className="text-gray-500">ИНН:</span> —</div>
              <div><span className="text-gray-500">Город:</span> —</div>
              <div><span className="text-gray-500">Улица:</span> —</div>
            </div>
            <div className="mt-5 text-right">
              <Button onClick={() => setIsAdvertiserInfoOpen(false)} className="px-4">Закрыть</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}