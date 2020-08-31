import React from 'react'
import styled, { createGlobalStyle } from "styled-components"
import * as R from "ramda"

//sony a6xxx series
//const sensorWidthInMm = 23.5
//const sensorWidthInPx = 6024

const trace = console.log(R.identity)
const round = num => Math.round(num * 10) / 10

const calcPixelPitch = (mm, px) => mm / px * 1000

const calculateShutterSpeed = (ap, fl, mm, px) => {
    const pixelPitch = calcPixelPitch(mm, px)
    const ss = ((35 * ap) + (30 * pixelPitch)) / fl
    return round(ss)
}

const isAnyNil = R.any(R.isNil)
const defaultToEmptyStr = R.defaultTo("")
const defaultToEmptyArrStr = R.defaultTo("[]")

const arrayFromStorage = key => {
    const lsv = localStorage.getItem(key)
    const v = defaultToEmptyArrStr(lsv)
    return JSON.parse(v)
} //R.pipe(localStorage.getItem, trace, defaultToEmptyArrStr, trace, JSON.parse)


const valuesFromStorage = arrayFromStorage("values")

const App = () => {

    const [sensorWidthMm, setSensorWidthMm] = React.useState(valuesFromStorage[0])
    const [sensorWidthPx, setSensorWidthPx] = React.useState(valuesFromStorage[1])
    const [aperture, setAperture] = React.useState(valuesFromStorage[2])
    const [focalLength, setFocalLength] = React.useState(valuesFromStorage[3])

    const values = [sensorWidthMm, sensorWidthPx, aperture, focalLength]

    const onValChange = setter => e => {
        const v = parseFloat(e.target.value)

        if(isNaN(v))
        {
            setter(null)
            return
        }
            
        setter(v)
    }

    React.useEffect(() => {
        console.log("values", values)
        localStorage.setItem("values", JSON.stringify(values))
    }, values)

    let shutterSpeed = null
    if(isAnyNil(values))
        shutterSpeed = null
    else
        shutterSpeed = calculateShutterSpeed(aperture, focalLength, sensorWidthMm, sensorWidthPx)


  return (
    <Container>
        <Title>NPF Rule Calculator</Title>
        <SubTitle>Calculate the max shutter speed to shoot the sky without star trailing using a fixed tripod.</SubTitle>

        <Box>
            <InputTitle>Physical Sensor Width Mm</InputTitle>
            <Input 
                type="number" 
                onChange={onValChange(setSensorWidthMm)} 
                defaultValue={defaultToEmptyStr(sensorWidthMm)}
                />
        </Box>

        <Box>
            <InputTitle>Sensor Width in Pixels</InputTitle>
            <Input 
                type="number" 
                onChange={onValChange(setSensorWidthPx)}
                defaultValue={defaultToEmptyStr(sensorWidthPx)}
                />
        </Box>

        <Box>
            <InputTitle>Aperture</InputTitle>
            <Input 
                type="number" 
                onChange={onValChange(setAperture)}
                defaultValue={defaultToEmptyStr(aperture)}
                />
        </Box>
        
        <Box>
            <InputTitle>Focal Length</InputTitle>
            <Input 
                type="number" 
                onChange={onValChange(setFocalLength)}
                defaultValue={defaultToEmptyStr(focalLength)}
                />
        </Box>
        
        {shutterSpeed && <Box>
            <h3>Max. Shutter Speed = {shutterSpeed}"</h3>
        </Box>}

        <GlobalStyle />
    </Container>
  )
}

const bg = "#292626"
const red = "#b01515"

const GlobalStyle = createGlobalStyle`
    body
    {
        background: ${bg};
        color: ${red};
        font-family: Verdana, Geneva, sans-serif;
        padding: 20px;
    }
`

const Container = styled.div`
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
`

const Title = styled.h1`
    margin-top: 0;
    width: 100%;
    text-align: center;
`

const SubTitle = styled.div`
    font-size: 13pt;
    margin: 10px 0 1Opx 0;
    text-align: center;
`

const InputTitle = styled.div`
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 5px;
`

const Input = styled.input`
    border: 1px solid ${red};
    background: ${bg};
    padding: 5px;
    color: ${red};
    width: 100%;

    &:focus
    {
        outline: none;
    }
`

const Box = styled.div`
    margin: 20px;
`



export default App
