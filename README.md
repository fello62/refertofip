### PROBLEMI STAMPA CON IOS
Nella stampa del referto nei dispositivi Apple con IOS si riscontra il problema dei margini che, con Safari e qualsiasi altro browser, non sono impostabili.

Questo comporta che la stampa del referto venga spezzata nella parte bassa, a meno che non si applichi uno zoom per ridurre la pagina a circa l'84%. Questa cosa però non è possibile con le versioni IOS più vecchie (ad esempio IOS9 oppure IOS10).

Inoltre ricordo che, per stampare un PDF sotto IOS, una volta aperta l'anteprima di stampa (aprire il menù cliccando il logo FIP, poi il bottone "Stampa referto"), occorre fare il movimento "pinch" (due dita sull'immagine cercando di allargarla).

### SALVATAGGIO E CARICAMENTO GARE
Il salvataggio ed il caricamento delle gare, con dispositivi Apple e versione IOS minore di 11, sono problematici per l'assenza dell'applicazione "File".

Negli appositi riquadri sono state quindi aggiunte delle aree di testo in cui poter eventualmente eseguire operazioni di copia/incolla col testo delle gare come modalità alternativa.

### LISTE R
Per accelerare la scrittura delle liste R nel referto, è possibile importarne il testo.

Bisogna disporre dell'utility a riga di comando "pdftotext", molto comune nelle macchine Linux ma disponibile come servizio online anche al sito https://pdftotext.com/.
Inoltre occorre avere a disposizione i file PDF contenenti le liste R.

Usando la linea di comando, occorre digitare:

  pdftotext -layout file.pdf

Il risultato sarà un "file.txt" contenente il testo della lista R di una delle due squadre.

A questo punto, nella pagina referto.html, cliccare il logo FIP per accedere al menù principale, e premere il bottone "Importa testo ListaR".
Si aprirà una finestra con due "radio buttons" per scegliere tra squadra A e B di chi è la lista; poi c'è una casella in cui va incollato il testo contenuto nel "file.txt" ricavato con pdftotext.
Premendo il bottone "INVIO" si conclude l'importazione.

Queste operazioni vanno ripetute in modo identico per la seconda squadra, anche se di solito è difficile avere a disposizione entrambi i file PDF; in questo caso la seconda squadra andrà digitata manualmente.
