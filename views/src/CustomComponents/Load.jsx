const Load = (visible) => {
    if (visible)
        document.getElementById('overlay').style.display = 'flex'
    else
        document.getElementById('overlay').style.display = 'none'
}

export default Load