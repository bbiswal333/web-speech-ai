'use strict';

const socket = io();

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');
const inputText = document.querySelector('.input-text');
const btnSend =   document.querySelector('.send-btn');

const you =  document.querySelector('.you');
const bot =  document.querySelector('.bot');
const messagePane =  document.querySelector('.message-pane');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

//
btnSend.addEventListener('click',() => {
	let text =  inputText.value;
	if(text!=""){
		
		//outputYou.textContent = text;
		$('.message-pane').append(' <p><span class="you" style="color:green"><b>You  :</b></span><em class="output-you">'+text+'</em></p>');
		socket.emit('chat message', text);
		inputText.value = "";
	}
});

function runScript(e) {
    if (e.keyCode == 13) {
        let text =  inputText.value;
		if(text!=""){
			//inputText.value = "";
			//outputYou.textContent = text;
			$('.message-pane').append(' <p><span class="you" style="color:green"><b>You  :</b></span><em class="output-you">'+text+'</em></p>');
			socket.emit('chat message', text);
			inputText.value = "";
			return false;
		}
    }
}

//


document.querySelector('button').addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
  console.log('Result has been detected.');

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  outputYou.textContent = text;
  console.log('Confidence: ' + e.results[0][0].confidence);

  socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
  recognition.stop();
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);
}

socket.on('bot reply', function(replyText) {
  synthVoice(replyText);

  if(replyText == '') replyText = '(No answer...)';
  //outputBot.textContent = replyText;
  
  //
  $('.message-pane').append('<p><span class="bot" style="color:blue"><b>Bot  :</b></span><em class="output-bot">'+replyText+'</em></p>');
});
