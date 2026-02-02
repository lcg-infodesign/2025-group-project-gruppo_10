Liberty Enlightening the World

Computer Graphics Studio for Information Design
A.Y. 2025/2026
Bachelor's Degree in Communication Design
Faculty Michele Mauri, Davide Conficconi
Teaching Assistants Alessandra Facchin, Alessandro Nazzari

© [CC-BY 4.0] The authors

Except where otherwise noted, all content on this website is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0). You are free to share and adapt the material, including for commercial use, provided appropriate credit is given. For questions about attribution or reuse, contact us at federica.besenzoni@mail.polimi.it; vittoria.franchi@mail.polimi.it; asia.marozzi@mail.polimi.it; aurora.preioni@mail.polimi.it;
jasmin.soraruf@mail.polimi.it; sheetal.zanotto@mail.polimi.it


TEAM
Siamo un gruppo di sei studentesse del Politecnico di Milano. Insieme abbiamo sviluppato Liberty Enlightening the World, un progetto realizzato per il corso di Information Design, al quale ciascuna di noi ha contribuito con competenze specifiche.
Federica Besenzoni: sviluppo della pagina di dettaglio dedicata alla visualizzazione della variazione del livello di libertà nel tempo per i singoli Stati.
Vittoria Franchi: progettazione grafica, sviluppo delle pagine About Us e About Freedom House, ricerca e redazione dei testi.
Asia Marozzi: sviluppo della visualizzazione generale e del dettaglio regionale, sviluppo della libreria condivisa e assemblaggio delle pagine.
Aurora Preioni: sviluppo della pagina di dettaglio dei singoli Paesi con visualizzazione dei punteggi delle sottodomande e ricerca delle cause delle variazioni di status.
Jasmin Soraruf: progettazione grafica ed infografica delle pagine generali e di dettaglio, analisi del dataset e realizzazione delle illustrazioni.
Sheetal Zanotto: sviluppo del codice per l’introduzione del progetto e debugging.
Durante il progetto abbiamo utilizzato l’intelligenza artificiale (Claude.ai) come supporto nello sviluppo del codice, in particolare:
ha fornito suggerimenti di implementazione per l’aggiunta di animazione e per il debugging;
ci ha supportati nella gestione delle funzioni più complesse.


IL PROGETTO 
Liberty Enlightening the World esplora il tema della libertà a partire dal dataset Freedom in the World di Freedom House, organizzazione no-profit, ma finanziata dal governo statunitense che, dal 2013, monitora annualmente il livello di libertà nei Paesi e territori del mondo attraverso un sistema di indicatori basato su diritti politici e libertà civili.
L’analisi dei dati ci ha fatto riflettere su una domanda centrale: che cos’è la libertà e fino a che punto può essere misurata? Il dataset di Freedom House propone una possibile risposta, traducendo un concetto complesso in valori numerici. Questa visione, pur presentandosi come oggettiva, riflette una prospettiva prevalentemente occidentale. Per rendere esplicito questo punto di vista, il progetto adotta come metafora visiva la Statua della Libertà, richiamata anche nel titolo, che riprende il nome originario dell’opera.
Il progetto si sviluppa su più livelli di lettura, dalla panoramica globale fino al dettaglio dei singoli Paesi, permettendo di esplorare sia l’andamento temporale della libertà sia la composizione del punteggio attraverso i diversi parametri.
La visualizzazione principale è costruita attorno alla torcia: ogni torcia rappresenta una regione geografica, mentre le barre che la compongono corrispondono a Paesi e territori. Il colore delle barre segna lo status assegnato da Freedom House (Free, Partly Free, Not Free). I tre colori sono stati scelti per rappresentare l’ossidazione del rame della statua, che diventa metafora del progressivo deterioramento della libertà.
Nel complesso, i dati mostrano un peggioramento diffuso negli ultimi anni. La visualizzazione invita quindi l’utente a riconoscere la libertà come una condizione fragile, storicamente e politicamente variabile, che non può essere data per scontata.


OBIETTIVI DI CONOSCENZA 

1° LIVELLO
Individuare le regioni, i Paesi e i territori di maggiore o minore tutela delle libertà.
La visualizzazione globale degli Stati e dei territori consente un confronto immediato tra le aree con diversi livelli di tutela delle libertà, ulteriormente approfondibile a livello regionale.
Rilevare la progressiva riduzione delle libertà nel tempo.
La dimensione temporale della visualizzazione permette di osservare l’evoluzione del livello di libertà nel tempo, mettendone in evidenza la progressiva riduzione in molti Paesi del mondo.

2° LIVELLO 
Comprendere e distinguere i parametri e sotto-parametri presi in considerazione per definire il punteggio totale di libertà. 
L’obiettivo emerge dalle pagine di dettaglio dedicate ai singoli Paesi, che permettono di comprendere come si compone il punteggio totale di libertà, mettendo in evidenza il contributo dei singoli parametri e sotto-parametri.

3° LIVELLO 
Comprendere le cause che hanno determinato variazioni dell’indice di libertà nei Paesi e territori che, nel corso degli anni, hanno registrato un cambiamento di “status”.
L’inserimento di brevi testi descrittivi per i Paesi consentono di comprendere il contesto sociale e politico responsabile delle variazioni significative dell’indice di libertà.


DATASET
https://freedomhouse.org/report/freedom-world
All Data, FIW 2013-2025 (Excel Download)

Il dataset Freedom in the World, realizzato da Freedom House, ha l’obiettivo di stimare il livello di libertà di un determinato Paese o territorio in uno specifico anno. La valutazione si basa su un sistema di punteggi che confluiscono in un total score, ottenuto dalla somma di due indicatori principali: Political Rights e Civil Liberties.

Il punteggio relativo ai Political Rights è costruito a partire da:
Electoral Process
Political Pluralism and Participation
Functioning of Government
Additional Question (incide sottraendo valore al punteggio complessivo)
Le Civil Liberties, invece, comprendono quattro aree di valutazione:
Freedom of Expression and Belief
Associational and Organizational Rights
Rule of Law
Personal Autonomy and Individual Rights

Nel corso degli anni, Freedom House ha introdotto alcune modifiche alla struttura del dataset. In particolare, nel 2017 è stata eliminata una domanda addizionale: questo intervento evidenzia come il sistema di valutazione non sia statico, ma soggetto a revisioni che influenzano la lettura dell’andamento della libertà nel tempo.
Ciascuna delle sottocategorie è composta da una serie di domande (generalmente tre o quattro), a ognuna delle quali è assegnato un punteggio compreso tra 0 e 4. La somma (e eventuale sottrazione dell’additional question) dei punteggi di tutte le domande determina il total score, sulla base del quale a ogni Paese viene attribuito uno status: Free, Partly Free o Not Free.