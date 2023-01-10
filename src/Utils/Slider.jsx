import ReactSlider from "react-slider"

export default function Slider(props) {
    const { value, setValue, className, trackClassName, sliderThumb } = props
    return (
        <ReactSlider
            className={className}
            trackClassName={trackClassName}
            thumbClassName={sliderThumb}
            value={value}
            max={300}
            onChange={setValue}
        />
    )
}