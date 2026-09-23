Per accelerare la scrittura delle liste R nel referto, è possibile importarne il testo.
Bisogna disporre dell'utility a riga di comando "pdftotext", molto comune nelle macchine Linux ma disponibile come servizio online anche al sito https://pdftotext.com/.
Inoltre occorre avere a disposizione i file PDF contenenti le liste R.
Usando la linea di comando, occorre digitare:
  pdftotext -layout file.pdf
Il risultato sarà un "file.txt" contenente il testo della lista R di una delle due squadre.
A questo punto, nella pagina referto.html, cliccare il logo FIP per accedere al menù principale, e premere il bottone "Importa teso ListaR".
Si aprirà una finestra con due "radio buttons" per scegliere tra squadra A e B di chi è la lista; poi c'è una casella in cui va incollato il testo contenuto nel "file.txt" ricavato con pdftotext.
Premendo il bottone "INVIO" si conclude l'importazione.
Queste operazioni vanno ripetute in modo identico per la seconda squadra, anche se di solito è difficile avere a disposizione entrambi i file PDF; in questo caso la seconda squadra andrà digitata manualmente.
