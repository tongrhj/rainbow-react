const GameEngine = React.createClass({
  getInitialState() {
    return {
      gameMode: 'start',
      colourClicked: '',
      previousRoundPoints: 0,
      points: 0,
      round: 1,
      answer: '',
      decoy: ''
    }
  },
  startGame(e) {
    e.preventDefault()
    this.setState({ gameMode: 'game'})
  },
  handleColourButtonClick(e) {
    e.preventDefault()
    this.setState({ colourClicked: e.target.value }, () => {
      this.state.colourClicked == this.state.answer ?
                                    this.setNextRound() :
                                    this.setState({ gameMode: 'end' })
    })
  },
  setNextRound() {
    this.incrementPoints()
    this.setState({ round: this.state.round + 1 }, () => {
      this.setQuestionColour(this.state.colourClicked)
    })
  },
  incrementPoints() {
    this.setState({ previousRoundPoints: this.state.points })
    const newPointsTotal = this.isRainbowRound() ?
      this.state.points + 7 :
      this.state.points + 1
    this.setState({ points: newPointsTotal })
  },
  roundColours() {
    return this.isRainbowRound() ?
      ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange'] :
      ['red', 'blue', 'green', 'yellow']
  },
  isRainbowRound() {
    return (this.state.round % 7 == 0)
  },
  setQuestionColour(previousRoundColour = '') {
    const colourList = this.roundColours()
    const answer = colourList[Math.floor(colourList.length * Math.random())]
    const decoy = colourList[Math.floor(colourList.length * Math.random())]
    if (answer == decoy || answer == previousRoundColour) {
      this.setQuestionColour(previousRoundColour)
    } else {
      this.setState({ answer, decoy })
    }
  },
  render() {
    let gameScreen;
    switch (this.state.gameMode) {
      case 'game':
        gameScreen = <ColourForm
                      answer={ this.state.answer }
                      decoy={ this.state.decoy }
                      points={ this.state.points }
                      previousRoundPoints={ this.state.previousRoundPoints }
                      colourList={ this.roundColours() }
                      handleColourButtonClick={ this.handleColourButtonClick }
                      setQuestionColour={ this.setQuestionColour }
                     />
        break;
      case 'end':
        gameScreen = <EndScreen
                      points={ this.state.points }
                      answer={ this.state.answer }
                      colourClicked={ this.state.colourClicked }
                      startGame={ this.startGame }
                     />
        break;
      default:
        gameScreen = <StartScreen startGame={ this.startGame }/>
    }
    return (
      <div>
        <h1>Rainbow Rex</h1>
        { gameScreen }
      </div>
    )
  }
})

const StartScreen = React.createClass({
  render() {
    return (
      <div>
        <StartGameBtn onClick={ this.props.startGame }>START</StartGameBtn>
      </div>
    )
  }
})

const EndScreen = React.createClass({
  render() {
    return (
      <div>
        <h1>GAME OVER</h1>
        <Points content={ this.props.points } />
        <ColourChosen
          content={ this.props.colourClicked }
          answer={ this.props.answer}
        />
        <button>Share on Facebook</button>
        <br/>
        <StartGameBtn onClick={ this.props.startGame }>Replay?</StartGameBtn>
      </div>
    )
  }
})

const StartGameBtn = React.createClass({
  render() {
    return (
      <button
        className='startGameBtn'
        onClick={ this.props.onClick }
      >
        { this.props.children }
      </button>
    )
  }
})

const ColourForm = React.createClass({
  componentDidMount() {
    this.props.setQuestionColour()
  },
  render() {
    return (
      <div className="colourForm">
        <Question
          answer={ this.props.answer }
          decoy={ this.props.decoy }
        />
        <Points
          content={ this.props.points }
          previousContent={ this.props.previousRoundPoints }
        />
        <ColourButtons
          colourList={ this.props.colourList }
          onClick={ this.props.handleColourButtonClick }
        />
      </div>
    )
  }
})

const Question = React.createClass({
  render() {
    const questionStyle = {
      color: this.props.decoy
    }
    return (
      <h1 style={ questionStyle }>
        { this.props.answer }
      </h1>
    )
  }
})

const Points = React.createClass({
  pointsIncreased() {
    if (this.props.previousContent) {
      return this.props.content > this.props.previousContent
    } else {
      return false
    }
  },
  render() {
    return (
      <h2 className={ this.pointsIncreased() ?
                      'pointsIncreased' :
                      'pointsDisplay' }>
        { this.props.content }
      </h2>
    )
  }
})

const ColourChosen = React.createClass({
  render() {
    return (
      <h5>
        You chose { this.props.content } instead of { this.props.answer }
      </h5>
    )
  }
})

const ColourButtons = React.createClass({
  render() {
    return (
      <div>
        { this.props.colourList.map(colour => {
            return (
              <ColourButton
                value={ colour }
                key={ colour }
                onClick={ this.props.onClick }
              />
            )
        })}
      </div>
    )
  }
})

const ColourButton = React.createClass({
  render() {
    return (
      <button {...this.props}>
        { this.props.value }
      </button>
    )
  }
})

ReactDOM.render(
  <GameEngine />,
  document.querySelector('#content')
)
