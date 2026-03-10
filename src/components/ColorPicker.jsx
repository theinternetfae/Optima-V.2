function ColorPicker({setColor, setCall}) {
    
    const customColors = [
        "#EF4444",
        "#DC2626",
        "#F87171",
        "#F97316",
        "#FB923C",
        "#EA580C",
        "#FACC15",
        "#EAB308",
        "#F59E0B",
        "#22C55E",
        "#4ADE80",
        "#16A34A",
        "#14B8A6",
        "#2DD4BF",
        "#06B6D4",
        "#3B82F6",
        "#60A5FA",
        "#2563EB",
        "#8B5CF6",
        "#A855F7",
        "#EC4899"
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