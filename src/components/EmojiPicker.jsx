import { useMemo, useState } from "react";

function Emoji() {

    const [category, setCategory] = useState("History");
    const categoryMatch = category.toLowerCase();


    const EMOJI_CATEGORIES = [

        {
            icon: 'bi-clock-history',
            label: 'History'
        },

        {
            icon: 'bi-building',
            label: 'Work'
        },

        {
            icon: 'bi-house-heart',
            label: 'Home'
        },

        {
            icon: 'bi-heart-pulse',
            label: 'Health'
        },

        {
            icon: 'bi-star-fill',
            label: 'Important'
        },

        {
            icon: 'bi-people',
            label: 'People'
        },

        {
            icon: 'bi-graph-up-arrow',
            label: 'Growth'
        },

    ]

    const [emojis, setEmojis] = useState([
        {
            id: 1,
            emoji: "💻",
            category: "work",
            count: 0
        },
        {
            id: 2,
            emoji: "📚",
            category: "work",
            count: 0
        },
        {
            id: 3,
            emoji: "🧠",
            category: "work",
            count: 0
        },
        {
            id: 4,
            emoji: "✏️",
            category: "work",
            count: 0
        },
        {
            id: 5,
            emoji: "💼",
            category: "work",
            count: 0
        },
        {
            id: 6,
            emoji: "🧹",
            category: "home",
            count: 0
        },
        {
            id: 7,
            emoji: "🛒",
            category: "home",
            count: 0
        },
        {
            id: 8,
            emoji: "🏠",
            category: "home",
            count: 0
        },
        {
            id: 9,
            emoji: "🧺",
            category: "home",
            count: 0
        },
        {
            id: 10,
            emoji: "📦",
            category: "home",
            count: 0
        },
        {
            id: 11,
            emoji: "🏃",
            category: "health",
            count: 0
        },
        {
            id: 12,
            emoji: "🧘",
            category: "health",
            count: 0
        },
        {
            id: 13,
            emoji: "🛏️",
            category: "health",
            count: 0
        },
        {
            id: 14,
            emoji: "💊",
            category: "health",
            count: 0
        },
        {
            id: 15,
            emoji: "💪",
            category: "health",
            count: 0
        },
        {
            id: 16,
            emoji: "⏰",
            category: "important",
            count: 0
        },
        {
            id: 17,
            emoji: "📅",
            category: "important",
            count: 0
        },
        {
            id: 18,
            emoji: "⌛",
            category: "important",
            count: 0
        },
        {
            id: 19,
            emoji: "🚨",
            category: "important",
            count: 0
        },
        {
            id: 20,
            emoji: "📞",
            category: "people",
            count: 0
        },
        {
            id: 21,
            emoji: "💬",
            category: "people",
            count: 0
        },
        {
            id: 22,
            emoji: "✉️",
            category: "people",
            count: 0
        },
        {
            id: 23,
            emoji: "👥",
            category: "people",
            count: 0
        },
        {
            id: 24,
            emoji: "🌱",
            category: "growth",
            count: 0
        },
        {
            id: 25,
            emoji: "🎯",
            category: "growth",
            count: 0
        },
        {
            id: 26,
            emoji: "🔥",
            category: "growth",
            count: 0
        },
        {
            id: 27,
            emoji: "✨",
            category: "growth",
            count: 0
        },
    ]);

    const HISTORY = useMemo(() => {
        const histArray = emojis.filter(e => e.count > 0)
        return histArray;
    }, [emojis])

    
    console.log(emojis);
    console.log("History count:", HISTORY);
    console.log(categoryMatch);

    return ( 

        <section className="emoji-picker">
        
            <div className="emoji-h">

                {
                    EMOJI_CATEGORIES.map(({icon, label}) => (
                        <i className={`bi ${icon} ${category === label && 'text-bluelight'}`} key={label} title={label} onClick={() => setCategory(label)}></i>
                    ))
                }

            </div>

            <div className="emoji-b">
                
                <ul>

                    {categoryMatch === "history" 
                        ? (

                            HISTORY.map(e => (
                                <li key={e.id} onClick={() => {
                                    setEmojis(prev => 
                                        prev.map(item => 
                                            item.id === e.id 
                                            ? {...item, count: item.count + 1}
                                            : item
                                        )
                                    );
                                }}>
                                    {e.emoji}
                                </li>
                            )
                            )

                        ) : (

                            emojis.map(e => (
                                e.category === categoryMatch && (
                                    <li key={e.id} onClick={() => {
                                        setEmojis(prev => 
                                            prev.map(item => 
                                                item.id === e.id 
                                                ? {...item, count: item.count + 1}
                                                : item
                                            )
                                        );
                                    }}>
                                        {e.emoji}
                                    </li>
                                )
                            ))

                        )
                    }
                </ul>

            </div>
        
        </section>
    
    );
}

export default Emoji;