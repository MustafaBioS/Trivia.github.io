function App () {
    const [state, setState] = React.useState(null);
    const [dots, setDots] = React.useState("");
    const questions = React.useRef("");

    // Once this page loads, fetch the API and make the consts

    function fetchAPI() {
    fetch("https://opentdb.com/api.php?amount=100&type=multiple")
    .then((res) => res.json())
    .then(data => {
    questions.current = data.results;
    newQuestion()
            });
    };

    function newQuestion() {
    const selected = questions.current.splice(Index, 1)[0];
    const Index = Math.floor(Math.random() * questions.current.length);
    const question = selected.question;
    const correct = selected.correct_answer;
    const incorrect = selected.incorrect_answers;
    const allAnswers = [...incorrect, correct];

    if (questions.current.length === 0) {

    } 
    
    // Fisher Yale Shuffle

    for (let i = allAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
    }

    setState(prev => {
        const score = prev ? prev.score : 0; 
        return {
        ...prev,
        question: question,
        answers: allAnswers,    
        correct: correct,
        incorrect: false,
        correctAnswer: false,
        score: prev ? prev.score : 0,
    }});
    };


React.useEffect(() => {
  fetchAPI();
}, []);

    function onButtonPress(answer) {
        if (answer === state.correct) 
            setState( {
            ...state,
            incorrect: false,
            correctAnswer: true,
            score: state.score + 1, 
        } );
        
        
        else {
            
            setState( {
                ...state,
                score: state.score - 1,
                incorrect: true,
                correctAnswer: false,
            
            });
        }
    
    setTimeout(() => {
        newQuestion();
    }, 200);

    };



    React.useEffect(() => { 
        if (!state) { 
            const interval = setInterval(() => {
        setDots(prev => (prev.length < 3 ? prev + '.' : ''));
        }, 500);
        
        return () => clearInterval(interval);
    }

}, [state]);


     return (
        <div className="container">

            {!state ? (
                <p className="loading">Loading{dots}</p>
                
            ) : !questions.current.length ? (
                <p className="NQL">No Questions Left.</p>
            ) : (
            
                
            
            <div>
            <h1 id="title">Trivia</h1>
            <div className="queCon">
            <p dangerouslySetInnerHTML={{__html: state.question}} className="questions"></p>
            </div> 
        <div className="btnCon">
            {state.answers.map((ans, i) => (
        <button key={i} dangerouslySetInnerHTML={{ __html: ans }} className="answers"
        onClick={() => onButtonPress(ans)}></button>
            ))}
        </div>
            <p id="score" className={state.incorrect ? "incorrect" : state.correctAnswer ? "correct" : "" } >score: {state.score}</p>
            </div>
            )}
        </div>
     )
}

ReactDOM.render(<App />, document.getElementById("app"));
