'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function SmartTVLanding() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+7 (');
  const [model, setModel] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [agreed, setAgreed] = useState(false);

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

  return (
    <div className="font-sans bg-white text-gray-900 relative">
      {/* Шапка с исправленной кнопкой CTA */}
      <header className="text-center py-12 px-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Настроим ТВ и YouTube за 20 минут — смотрите бесплатно и без подписки</h1>
        <p className="text-xl opacity-90 mb-6 max-w-2xl mx-auto">
          Без лишних приложений. Только вы подтверждаете каждое действие
        </p>
        <ul className="text-left max-w-xl mx-auto text-lg md:text-xl space-y-2">
          <li>✅ Более 1000 каналов и YouTube без ограничений</li>
          <li>✅ Настройка через AnyDesk — вы подтверждаете каждое действие</li>
          <li>✅ Оплата только после результата</li>
        </ul>
        <a href="#contact">
          {/* Исправленная главная кнопка CTA */}
          <Button className="mt-6 bg-gradient-to-r from-green-400 to-lime-500 hover:from-green-500 hover:to-lime-600 text-white text-base sm:text-lg px-4 py-3 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center w-full max-w-[280px] mx-auto sm:max-w-none sm:w-auto whitespace-normal break-words text-center">
            <span className="shrink-0">🚀</span>
            <span className="flex-1">Начать бесплатно</span>
          </Button>
        </a>
        <div className="mt-4 text-sm opacity-80">
          ⏱️ Обычно занимает 23 минуты
        </div>
      </header>

      <motion.section {...sectionAnim} className="py-10 px-4 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>✔ Без подписок</div>
        <div>✔ YouTube, 1000+ каналов</div>
        <div>✔ Удалённая настройка (20–30 мин)</div>
        <div>✔ Оплата после результата</div>
      </motion.section>

      {/* Блок тарифов */}
      <motion.section {...sectionAnim} className="py-10 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Выберите оптимальный пакет</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              title: 'Кинотеатр', 
              price: '599 ₽',
              feature: '1000+ фильмов и сериалов'
            },
            { 
              title: 'Каналы', 
              price: '599 ₽',
              feature: 'Спорт, новости, детские, международные'
            },
            { 
              title: 'Всё вместе', 
              price: '1 000 ₽',
              feature: 'Максимум развлечений — экономия 200₽',
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

      {/* Восстановленный блок логотипов */}
      <motion.section {...sectionAnim} className="py-10 px-4 text-center bg-gray-100">
        <h2 className="text-2xl font-semibold mb-6">Совместимо с большинством Smart TV</h2>
        <div className="flex flex-wrap justify-center items-center gap-6 px-4">
          <img src="/samsung.svg" alt="Samsung" className="w-20 h-14 md:w-24 md:h-16 object-contain" />
          <img src="/lg.svg" alt="LG" className="w-20 h-14 md:w-24 md:h-16 object-contain" />
          <img src="/xiaomi.svg" alt="Xiaomi" className="w-20 h-14 md:w-24 md:h-16 object-contain" />
          <img src="/androidtv.svg" alt="Android TV" className="w-20 h-14 md:w-24 md:h-16 object-contain" />
        </div>
      </motion.section>

      {/* Восстановленный блок о мастере */}
      <motion.section {...sectionAnim} className="py-10 px-4 max-w-3xl mx-auto text-center text-gray-700 text-sm">
        <p className="bg-blue-50 p-6 rounded-lg">
          👨‍💻 Я настраиваю Smart TV более 2 лет. Все действия согласовываются через AnyDesk — вы подтверждаете каждое действие. Уже более 1000 довольных клиентов по всей России.
        </p>
      </motion.section>

      {/* Улучшенный блок отзывов */}
      <motion.section {...sectionAnim} className="py-10 px-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Отзывы</h2>
        <p className="text-center text-gray-700 font-medium mb-6">1000+ довольных клиентов по всей России</p>
        
        <div className="space-y-6">
          <Review img="/avatar.jpg" name="Ирина С." text="«Настроили за 20 минут! Всё работает супер. Спасибо!»" />
          <Review img="/avatar2.jpg" name="Дмитрий К." text="«Подключили YouTube и кино. Очень доволен, всё быстро и понятно!»" />
          <Review img="/avatar3.jpg" name="Елена М." text="«Настроили на телевизоре LG — теперь ребёнок смотрит мультики без рекламы!»" />
        </div>
        
        {/* Блок видеоотзыва */}
        <div className="mt-8 bg-gray-50 rounded-xl p-4 text-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center mb-4">
            <span className="text-gray-500">📹 Видеоотзыв клиента</span>
          </div>
          <p className="text-sm text-gray-600">Посмотрите реальный процесс настройки и отзыв клиента</p>
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
      </footer>

      {/* Плавающая кнопка с z-index */}
      <a href="#contact" className="fixed bottom-4 right-4 z-50 block md:hidden">
        <Button className="bg-gradient-to-r from-green-400 to-lime-500 text-white rounded-full px-5 py-3 shadow-xl hover:shadow-lg transition-all duration-200">
          🚀 Записаться
        </Button>
      </a>
    </div>
  );
}