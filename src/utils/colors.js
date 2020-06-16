function openStateColor(openState) {
  return {
    YES: '#68D391',
    PARTIALLY: '#F6AD55',
    NO: '#f28f91',
  }[openState]
}

function openStateStrokeColor(openState) {
  return {
    YES: '#38A169',
    PARTIALLY: '#DD6B20',
    NO: '#F84244',
  }[openState]
}

function shopColor({ openState }) {
  return openStateColor(openState)
}

function shopStrokeColor({ openState }) {
  return openStateStrokeColor(openState)
}

export { openStateColor, openStateStrokeColor, shopColor, shopStrokeColor }
