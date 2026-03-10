function ColorPicker({setColor, setCall}) {
    
    const customColors = [
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF"
    ]

    return ( 
        <div className="color-picker">
            
            <div className="color-box">
                {
                    customColors.map((customColor, i) => 
                        <span key={i} className="color-circle" style={{backgroundColor: customColor}} onClick={
                            () => {
                                setColor(customColor)
                                setCall()
                            }
                        }></span>
                    )
                }
            </div>

        </div>
    );
}

export default ColorPicker;