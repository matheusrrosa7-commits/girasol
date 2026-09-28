(function(){
  var LIKERT4 = [
    {v:0, t:"Nunca"},
    {v:1, t:"Às vezes"},
    {v:2, t:"Frequentemente"},
    {v:3, t:"Todos os dias"}
  ];
  var LIKERT5 = [
    {v:0, t:"Nunca"},
    {v:1, t:"Quase nunca"},
    {v:2, t:"Às vezes"},
    {v:3, t:"Frequentemente"},
    {v:4, t:"Muito frequentemente"}
  ];

  var questions = [
    {domain:"phq", label:"Humor", text:"Você tem pouco interesse ou prazer em fazer as coisas?", opts:LIKERT4},
    {domain:"phq", label:"Humor", text:"Você se sente para baixo, deprimido(a) ou sem esperança?", opts:LIKERT4},
    {domain:"phq", label:"Humor", text:"Você tem dificuldade para dormir? ou dorme demais?", opts:LIKERT4},
    {domain:"phq", label:"Humor", text:"Você se sente cansado(a) e sem energia?", opts:LIKERT4},
    {domain:"phq", label:"Humor", text:"Você tem falta de apetite ou come em excesso?", opts:LIKERT4},
    {domain:"phq", label:"Humor", text:"Você se sente mal consigo mesmo(a)?", opts:LIKERT4},
    {domain:"phq", label:"Humor", text:"Você tem dificuldade para se concentrar?", opts:LIKERT4},
    {domain:"phq", label:"Humor", text:"Você se sente muito lento(a)? ou acelerado(a)?", opts:LIKERT4},
    {domain:"phq", label:"Humor", text:"Você tem pensamentos de morte ou de se machucar?", opts:LIKERT4, flag:"selfharm"},

    {domain:"gad", label:"Ansiedade", text:"Você se sente nervoso(a), ansioso(a) ou tenso(a)?", opts:LIKERT4},
    {domain:"gad", label:"Ansiedade", text:"Não consegue controlar as preocupações(a)?", opts:LIKERT4},
    {domain:"gad", label:"Ansiedade", text:"Você se preocupa demais com diferentes coisas?", opts:LIKERT4},
    {domain:"gad", label:"Ansiedade", text:"Você tem Dificuldade para relaxar?", opts:LIKERT4},
    {domain:"gad", label:"Ansiedade", text:"Você tem inquietação que dificulta permanecer parado(a)?", opts:LIKERT4},
    {domain:"gad", label:"Ansiedade", text:"Você se Irrita facilmente?", opts:LIKERT4},
    {domain:"gad", label:"Ansiedade", text:"Você Sente medo como se algo ruim fosse acontecer?", opts:LIKERT4},

    {domain:"pss", label:"Estresse (mês)", text:"Você fica aborrecido(a) por algo inesperado?", opts:LIKERT5},
    {domain:"pss", label:"Estresse (mês)", text:"Você sente que não consegue controlar coisas importantes da sua vida?", opts:LIKERT5},
    {domain:"pss", label:"Estresse (mês)", text:"Você se sente nervoso(a) e estressado(a)?", opts:LIKERT5},
    {domain:"pss", label:"Estresse (mês)", text:"Você sente confiança na sua capacidade de resolver problemas pessoais?", opts:LIKERT5, reverse:true},
    {domain:"pss", label:"Estresse (mês)", text:"Você sente que as coisas estão correndo bem?", opts:LIKERT5, reverse:true},
    {domain:"pss", label:"Estresse (mês)", text:"Você sente que não consegue lidar com todas as suas tarefas?", opts:LIKERT5},
    {domain:"pss", label:"Estresse (mês)", text:"Você Consegue controlar irritações em sua vida?", opts:LIKERT5, reverse:true},
    {domain:"pss", label:"Estresse (mês)", text:"Você sente que tem tudo sob controle?", opts:LIKERT5, reverse:true},
    {domain:"pss", label:"Estresse (mês)", text:"Você Fica irritado(a) por situações fora do seu controle?", opts:LIKERT5},
    {domain:"pss", label:"Estresse (mês)", text:"Você sente que as dificuldades estavam se acumulando e não conseguia superá-las?", opts:LIKERT5}
  ];

  var answers = new Array(questions.length).fill(null);
  var current = 0;

  var viewIntro = document.getElementById("view-intro");
  var viewQuiz = document.getElementById("view-quiz");
  var viewResults = document.getElementById("view-results");
  var progressFill = document.getElementById("progress-fill");
  var qDomain = document.getElementById("q-domain");
  var qCount = document.getElementById("q-count");
  var qText = document.getElementById("q-text");
  var qOptions = document.getElementById("q-options");
  var btnNext = document.getElementById("btn-next");
  var btnBack = document.getElementById("btn-back");

  document.getElementById("btn-start").addEventListener("click", function(){
    viewIntro.classList.add("hidden");
    viewQuiz.classList.remove("hidden");
    renderQuestion();
  });

  document.getElementById("btn-restart").addEventListener("click", function(){
    answers = new Array(questions.length).fill(null);
    current = 0;
    viewResults.classList.add("hidden");
    viewQuiz.classList.remove("hidden");
    renderQuestion();
  });

  function renderQuestion(){
    var q = questions[current];
    qDomain.textContent = q.label;
    qCount.textContent = "Pergunta " + (current+1) + " de " + questions.length;
    qText.textContent = q.text;
    progressFill.style.width = (current/questions.length*100) + "%";

    qOptions.innerHTML = "";
    q.opts.forEach(function(opt, idx){
      var label = document.createElement("label");
      label.className = "opt";
      if(answers[current] === opt.v){ label.classList.add("selected"); }
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "q" + current;
      input.value = opt.v;
      if(answers[current] === opt.v){ input.checked = true; }
      input.addEventListener("change", function(){
        answers[current] = opt.v;
        Array.prototype.forEach.call(qOptions.querySelectorAll(".opt"), function(el){ el.classList.remove("selected"); });
        label.classList.add("selected");
        btnNext.disabled = false;
      });
      var span = document.createElement("span");
      span.textContent = opt.t;
      label.appendChild(input);
      label.appendChild(span);
      qOptions.appendChild(label);
    });

    btnNext.disabled = answers[current] === null;
    btnNext.textContent = (current === questions.length - 1) ? "Ver conselho" : "Próxima";
    btnBack.disabled = current === 0;
  }

  btnNext.addEventListener("click", function(){
    if(answers[current] === null) return;
    if(current < questions.length - 1){
      current++;
      renderQuestion();
    } else {
      showResults();
    }
  });

  btnBack.addEventListener("click", function(){
    if(current > 0){
      current--;
      renderQuestion();
    }
  });

  function scoreOf(domain){
    var total = 0;
    questions.forEach(function(q, i){
      if(q.domain !== domain) return;
      var v = answers[i];
      if(v === null) v = 0;
      if(q.reverse){
        var max = q.opts[q.opts.length-1].v;
        v = max - v;
      }
      total += v;
    });
    return total;
  }

  function selfHarmFlagged(){
    var idx = questions.findIndex(function(q){ return q.flag === "selfharm"; });
    return idx > -1 && answers[idx] > 0;
  }

  function tierOf(domain, score){
    if(domain === "phq" || domain === "gad"){
      if(score <= 4) return 0;
      if(score <= 9) return 1;
      if(score <= 14) return 2;
      return 3;
    }
    // pss
    if(score <= 13) return 0;
    if(score <= 19) return 1;
    if(score <= 26) return 2;
    return 3;
  }

  var GENERAL_ADVICE = [
    "Você parece estar num bom equilíbrio neste momento. Continue cuidando do sono, da rotina e das pessoas ao seu redor, e volte a fazer este check-in sempre que sentir necessidade.",
    "Há sinais leves de desgaste. Pequenos ajustes já ajudam bastante agora: dormir melhor, se movimentar, manter contato com pessoas próximas e reservar pausas reais no dia. Se esse desconforto continuar por mais de duas semanas, vale conversar com um(a) psicólogo(a).",
    "Os sinais sugerem um desgaste que merece atenção. Recomendamos buscar apoio de um(a) psicólogo(a) para conversar sobre o que você tem sentido — nesse momento, o acompanhamento profissional costuma fazer bastante diferença.",
    "Os sinais indicam um sofrimento importante. Procure um(a) psicólogo(a) ou psiquiatra o quanto antes para uma avaliação e um apoio mais próximo. Se possível, fale hoje mesmo com alguém de confiança sobre como você está."
  ];

  function generalAdvice(){
    var tiers = ["phq","gad","pss"].map(function(d){ return tierOf(d, scoreOf(d)); });
    var worst = Math.max.apply(null, tiers);
    return GENERAL_ADVICE[worst];
  }

  function showResults(){
    viewQuiz.classList.add("hidden");
    viewResults.classList.remove("hidden");

    var alertSlot = document.getElementById("alert-slot");
    alertSlot.innerHTML = "";
    if(selfHarmFlagged()){
      var alert = document.createElement("div");
      alert.className = "alert";
      alert.innerHTML = "<strong>Se você está pensando em se machucar, não espere.</strong>Fale agora com o CVV: ligue 188 (24h, gratuito) ou acesse cvv.org.br para conversar por chat. Você não precisa passar por isso sozinho(a).";
      alertSlot.appendChild(alert);
    }

    var adviceSlot = document.getElementById("advice-slot");
    adviceSlot.innerHTML = "";
    var block = document.createElement("div");
    block.className = "advice-block";
    block.innerHTML = "<p>" + generalAdvice() + "</p>";
    adviceSlot.appendChild(block);
  }
})();
