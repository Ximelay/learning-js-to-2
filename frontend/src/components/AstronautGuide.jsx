import { useState, useEffect } from 'react';
import './AstronautGuide.css';

const messages = {
    welcome: "Привет, космонавт! Готов исследовать Галактику JavaScript?",
    planet: "Эта планета полна интересных задач...",
    taskStart: "Редактор активирован. Пиши чистый код, я наблюдаю за тобой ✨",
    taskSuccess: "Отличная работа! Синхронизация с ядром галактики прошла успешно!",
    taskFail: "Не волнуйся, даже лучшие астронавты иногда ловят баги. Попробуй ещё раз!",
    levelComplete: "Планета успешно покорена! Ты — настоящий Код-Навигатор!",
    boss: "Внимание! Приближается Чёрная Дыра Асинхронности...",
};

export default function AstronautGuide({ variant = "default", customMessage = "" }) {
    const [message, setMessage] = useState(messages.welcome);
    const [isActive, setIsActive] = useState(false);

    const speak = (key) => {
        setIsActive(true);
        setMessage(messages[key] || customMessage || messages.welcome);

        setTimeout(() => {
            setIsActive(false);
        }, 4000);
    };

    useEffect(() => {
        if (variant === "task") speak("taskStart");
        if (variant === "success") speak("taskSuccess");
        if (variant === "complete") speak("levelComplete");
    }, [variant]);

    return (
        <div className={`astronaut-guide ${isActive ? 'active' : ''}`}>
            <div className="speech-bubble">
                {message}
            </div>

            <div>
                <div className="box-of-star1">
                    <div className="star star-position1" />
                    <div className="star star-position2" />
                    <div className="star star-position3" />
                    <div className="star star-position4" />
                    <div className="star star-position5" />
                    <div className="star star-position6" />
                    <div className="star star-position7" />
                </div>
                <div className="box-of-star2">
                    <div className="star star-position1" />
                    <div className="star star-position2" />
                    <div className="star star-position3" />
                    <div className="star star-position4" />
                    <div className="star star-position5" />
                    <div className="star star-position6" />
                    <div className="star star-position7" />
                </div>
                <div className="box-of-star3">
                    <div className="star star-position1" />
                    <div className="star star-position2" />
                    <div className="star star-position3" />
                    <div className="star star-position4" />
                    <div className="star star-position5" />
                    <div className="star star-position6" />
                    <div className="star star-position7" />
                </div>
                <div className="box-of-star4">
                    <div className="star star-position1" />
                    <div className="star star-position2" />
                    <div className="star star-position3" />
                    <div className="star star-position4" />
                    <div className="star star-position5" />
                    <div className="star star-position6" />
                    <div className="star star-position7" />
                </div>
                <div data-js="astro" className="astronaut">
                    <div className="head" />
                    <div className="arm arm-left" />
                    <div className="arm arm-right" />
                    <div className="body">
                        <div className="panel" />
                    </div>
                    <div className="leg leg-left" />
                    <div className="leg leg-right" />
                    <div className="schoolbag" />
                </div>
            </div>
        </div>
    );
}