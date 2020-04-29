function openStateColor(openState) {
  return {
    YES: '#68D391',
    PARTIALLY: '#F6AD55',
    NO: '#F687B3',
  }[openState]
}

function openStateStrokeColor(openState) {
  return {
    YES: '#38A169',
    PARTIALLY: '#DD6B20',
    NO: '#D53F8C',
  }[openState]
}

function shopColor({ openState }) {
  return openStateColor(openState)
}

function shopStrokeColor({ openState }) {
  return openStateStrokeColor(openState)
}

export { openStateColor, openStateStrokeColor, shopColor, shopStrokeColor }
