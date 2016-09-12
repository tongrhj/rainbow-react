const GameEngine = React.createClass({
  getInitialState() {
    return {
      gameMode: 'start',
      colourClicked: '',
      previousRoundPoints: 0,
      points: 0,
      round: 1,
      answer: '',
      decoy: '',
      timeRemaining: 5
    }
  },
  startGame(e) {
    e.preventDefault()
    this.setState({ gameMode: 'game'})
  },
  restartGame(e) {
    e.preventDefault()
    let defaultValues = this.getInitialState()
    defaultValues['gameMode'] = 'game'
    this.setState(defaultValues)
  },
  handleCountdownComplete() {
    this.setState({ gameMode: 'endOutOfTime' })
  },
  handleColourBtnClick(e) {
    e.preventDefault()
    this.setState({ colourClicked: e.target.value }, () => {
      this.state.colourClicked == this.state.answer ?
        this.setNextRound() :
        this.setState({ gameMode: 'endWrongColour' })
    })
  },
  setNextRound() {
    this.incrementPoints()
    this.incrementTime()
    this.setState({ round: this.state.round + 1 }, () => {
      this.setQuestionColour(this.state.colourClicked)
    })
  },
  incrementTime() {
    this.setState({ timeRemaining: this.state.timeRemaining + 10 })
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
    answer == decoy || answer == previousRoundColour ?
      this.setQuestionColour(previousRoundColour) :
      this.setState({ answer, decoy })
  },
  gameScreen() {
    switch (this.state.gameMode) {
      case 'game':
        return <div>
                  <Countdown
                    timeRemaining={ this.state.timeRemaining }
                    handleCountdownComplete={ this.handleCountdownComplete }
                  />
                  <ColourForm
                    answer={ this.state.answer }
                    decoy={ this.state.decoy }
                    points={ this.state.points }
                    previousRoundPoints={ this.state.previousRoundPoints }
                    colourList={ this.roundColours() }
                    handleColourBtnClick={ this.handleColourBtnClick }
                    setQuestionColour={ this.setQuestionColour }
                  />
                </div>
        break;
      case 'endOutOfTime':
        return <EndScreen
                points={ this.state.points }
                handleStartBtnClick={ this.restartGame }>
                You ran out of time.
               </EndScreen>
      case 'endWrongColour':
        return <EndScreen
                points={ this.state.points }
                handleStartBtnClick={ this.restartGame }>
                You clicked { this.state.colourClicked } instead of { this.state.answer }
               </EndScreen>
        break;
      case 'start':
      default:
        return <StartScreen handleStartBtnClick={ this.startGame }/>
    }
  },
  render() {
    return (
      <div>
        <h1>Rainbow Rex</h1>
        { this.gameScreen() }
      </div>
    )
  }
})

const StartScreen = React.createClass({
  render() {
    return (
      <div>
        <StartBtn onClick={ this.props.handleStartBtnClick }>START</StartBtn>
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
        <EndScreenMessage>{ this.props.children }</EndScreenMessage>
        <button>Share on Facebook</button>
        <br/>
        <StartBtn onClick={ this.props.handleStartBtnClick }>Replay?</StartBtn>
      </div>
    )
  }
})

const StartBtn = React.createClass({
  render() {
    return (
      <button
        className='startBtn'
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
      <div className='colourForm'>
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
          onClick={ this.props.handleColourBtnClick }
        />
      </div>
    )
  }
})

const CountdownTimer = React.createClass({
  getInitialState() {
    return {
      secondsRemaining: this.props.secondsRemaining
    }
  },
  tick() {
    this.setState({secondsRemaining: this.state.secondsRemaining - 1})
    if (this.state.secondsRemaining <= 0) {
      clearInterval(this.interval)
      if (this.props.completeCallback) { this.props.completeCallback(); }
    }
  },
  componentDidMount() {
    this.interval = setInterval(this.tick, 1000)
  },
  componentWillUnmount() {
    clearInterval(this.interval)
  },
  render() {
    return (
      <div>Seconds Remaining: {this.state.secondsRemaining}</div>
    )
  }
})

const Countdown = React.createClass({
  render () {
    return (
      <div>
        <CountdownTimer
          secondsRemaining={ this.props.timeRemaining }
          completeCallback={ this.props.handleCountdownComplete }
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

const EndScreenMessage = React.createClass({
  render() {
    return (
      <h5>
        { this.props.children }
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
