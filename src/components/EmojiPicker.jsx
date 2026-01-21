import { useEffect, useMemo, useState } from "react";
import EMOJIS from "./Emojis.js";

function Emoji({showing, setting}) {

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

    const [emojis, setEmojis] = useState(() => {
        const savedEmojis = localStorage.getItem("emojis");
        return savedEmojis ? JSON.parse(savedEmojis) : EMOJIS;
    });

    useEffect(() => {
        localStorage.setItem("emojis", JSON.stringify(emojis));
    }, [emojis]);


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

                                    setting(e.emoji);

                                    setTimeout(() => {
                                        showing();
                                    }, 0)

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

                                        setting(e.emoji);
                                        setTimeout(() => {
                                            showing();
                                        }, 0)
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