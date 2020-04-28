function openStateColor(openState) {
  return {
    YES: '#66C87A',
    PARTIALLY: '#FB8F2B',
    NO: '#9C9C9C',
  }[openState]
}

function openStateStrokeColor(openState) {
  return {
    YES: '#00B263',
    PARTIALLY: '#E28228',
    NO: '#8B8B8B',
  }[openState]
}

function shopColor({ openState }) {
  return openStateColor(openState)
}

function shopStrokeColor({ openState }) {
  return openStateStrokeColor(openState)
}

export { openStateColor, openStateStrokeColor, shopColor, shopStrokeColor }
