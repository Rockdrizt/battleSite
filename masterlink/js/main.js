
var container = $(".container");
var arrayList = [
    {
        name:"#host:",
        link:"https://yogome.github.io/MathTournament/src/sections/battle/servertest.html#prueba001"
    },
    {
        name:"#cliente1:",
        link:"https://yogome.github.io/MathTournament/src/sections/clientGame/index.html#prueba001"
    },
    {
        name:"#cliente2:",
        link:"https://yogome.github.io/MathTournament/src/sections/clientGame/index.html#prueba001"
    },
    {
        name:"#bg_screen/team1:",
        link:"https://yogome.github.io/MathTournament/bg_players/?team=1#prueba001"
    },
    {
        name:"#bg_screen/team2:",
        link:"https://yogome.github.io/MathTournament/bg_players/?team=2#prueba001"
    },
    {
        name:"#scores:",
        link:"https://yogome.github.io/MathTournament/src/sections/scores/#prueba001"
    },
    {
        name:"#podio/team1/player1:",
        link:"https://yogome.github.io/MathTournament/src/sections/playerScreen/index.html#prueba001/1/0"
    },
    {
        name:"#podio/team1/player2:",
        link:"https://yogome.github.io/MathTournament/src/sections/playerScreen/index.html#prueba001/1/1"
    },
    {
        name:"#podio/team1/player3:",
        link:"https://yogome.github.io/MathTournament/src/sections/playerScreen/index.html#prueba001/1/2"
    },
    {
        name:"#podio/team2/player1:",
        link:"https://yogome.github.io/MathTournament/src/sections/playerScreen/index.html#prueba001/2/0"
    },
    {
        name:"#podio/team2/player2:",
        link:"https://yogome.github.io/MathTournament/src/sections/playerScreen/index.html#prueba001/1/1"
    },
    {
        name:"#podio/team2/player3:",
        link:"https://yogome.github.io/MathTournament/src/sections/playerScreen/index.html#prueba001/2/2"
    } 
]
for(var i= 0; i<arrayList.length;i++){
        container.append(
            `<div class="linkGroup">
            <h2>`+arrayList[i].name+`</h2>
            <a href=`+arrayList[i].link+`><div class="btn">Entra Aquí</div></a>
            </div>
            <div class="qrCode`+ i +`"></div>
            `
        );
    
    jQuery('.qrCode' + i).qrcode({
		text	: arrayList[i].link
	});	
}
