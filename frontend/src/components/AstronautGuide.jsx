import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './AstronautGuide.css';

const messages = {
    planet: "Эта планета содержит важную теорию. Почитай перед задачами! У тебя всё получится!",
    taskStart: "Редактор активирован. Пиши чистый код ✨",
    taskSuccess: "Отличная работа! Синхронизация прошла успешно!",
    taskFail: "Не волнуйся, даже лучшие астронавты иногда ловят баги.",
};

const externalLinks = {
    1: "https://metanit.com/web/javascript/2.1.php",
    2: "https://metanit.com/web/javascript/2.6.php",
    3: "https://metanit.com/web/javascript/2.7.php",
    4: "https://metanit.com/web/javascript/3.1.php",
    5: "https://metanit.com/web/javascript/5.3.php",
    6: "https://metanit.com/web/javascript/4.1.php",
    7: "https://metanit.com/web/javascript/8.1.php",
    8: "https://metanit.com/web/javascript/9.1.php",
};

export default function AstronautGuide({ variant = "default", levelId = null }) {
    const location = useLocation();
    const [message, setMessage] = useState(messages.planet);
    const [isActive, setIsActive] = useState(false);

    // Показываем только на островах и задачах
    const isVisible = location.pathname.startsWith('/levels') ||
        location.pathname.startsWith('/tasks');

    // Меняем реплику в зависимости от variant
    useEffect(() => {
        if (variant === "task") {
            setMessage(messages.taskStart);
        } else if (variant === "success") {
            setMessage(messages.taskSuccess);
        } else if (variant === "planet" || variant === "default") {
            setMessage(messages.planet);
        }
    }, [variant]);

    const link = levelId ? externalLinks[levelId] : null;

    if (!isVisible) return null;

    return (
        <div className={`astronaut-guide ${isActive ? 'active' : ''}`}>
            <div className="speech-bubble">
                {message}
                {link && (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="external-link-btn"
                    >
                        <div className="loader">
                            <svg width={100} height={100} viewBox="0 0 100 100">
                                <defs>
                                    <mask id="clipping">
                                        <polygon points="0,0 100,0 100,100 0,100" fill="black" />
                                        <polygon points="25,25 75,25 50,75" fill="white" />
                                        <polygon points="50,25 75,75 25,75" fill="white" />
                                        <polygon points="35,35 65,35 50,65" fill="white" />
                                        <polygon points="35,35 65,35 50,65" fill="white" />
                                        <polygon points="35,35 65,35 50,65" fill="white" />
                                        <polygon points="35,35 65,35 50,65" fill="white" />
                                    </mask>
                                </defs>
                            </svg>
                            <div className="box" />
                        </div>
                    </a>
                )}
            </div>

            <div className="astronaut-wrapper">
                <div className="box-of-star1"><div className="star star-position1" /><div className="star star-position2" /><div className="star star-position3" /><div className="star star-position4" /><div className="star star-position5" /><div className="star star-position6" /><div className="star star-position7" /></div>
                <div className="box-of-star2"><div className="star star-position1" /><div className="star star-position2" /><div className="star star-position3" /><div className="star star-position4" /><div className="star star-position5" /><div className="star star-position6" /><div className="star star-position7" /></div>
                <div className="box-of-star3"><div className="star star-position1" /><div className="star star-position2" /><div className="star star-position3" /><div className="star star-position4" /><div className="star star-position5" /><div className="star star-position6" /><div className="star star-position7" /></div>
                <div className="box-of-star4"><div className="star star-position1" /><div className="star star-position2" /><div className="star star-position3" /><div className="star star-position4" /><div className="star star-position5" /><div className="star star-position6" /><div className="star star-position7" /></div>

                <div className="astronaut">
                    <div className="head" />
                    <div className="arm arm-left" />
                    <div className="arm arm-right" />
                    <div className="body"><div className="panel" /></div>
                    <div className="leg leg-left" />
                    <div className="leg leg-right" />
                    <div className="schoolbag" />
                </div>
            </div>
        </div>
    );
}