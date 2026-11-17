// Procedural typography: every glyph follows a continuous, travelling tide field.
let phase=0,paused=false,english=false,atlas,glow;
function setup(){createCanvas(windowWidth,windowHeight);pixelDensity(Math.min(devicePixelRatio,2));textFont('monospace');buildGlow();document.querySelector('#lang').onclick=()=>english=!english;document.querySelector('#pause').onclick=()=>{paused=!paused;document.querySelector('#pause').textContent=paused?'继续':'暂停'};document.querySelector('#full').onclick=()=>fullscreen(!fullscreen());document.querySelector('#save').onclick=()=>saveCanvas('information-tide','png');}
function buildGlow(){glow=createGraphics(128,128);glow.noStroke();for(let r=64;r>0;r--){glow.fill(255,0.7);glow.circle(64,64,r*2)}}
function crest(y,t){return .39+.23*sin(t*.46)+.038*sin(y*11+t*1.4)+.022*sin(y*27-t*2)+.011*sin(y*57+t*2.7)+.005*sin(y*117-t*3)}
function draw(){if(!paused)phase+=Math.min(deltaTime,50)*.001*Number(document.querySelector('#speed').value);background(6);const t=phase;const unit=Math.max(10,height/62),cols=Math.ceil(width/unit),rows=Math.ceil(height/unit);textSize(unit*.91);textAlign(CENTER,CENTER);noStroke();
// Low, silver water glow underneath the type.
for(let j=0;j<rows;j++){let y=j*unit,u=y/height,c=crest(u,t)*width;for(let k=-4;k<=4;k++){let a=Math.exp(-k*k/7)*3;fill(255,a);rect(c+k*unit*2,y,unit*2,unit+1)}}
// Right-hand monumental lettering is part of the water, like the reference.
push();fill(255,24);textFont('Arial');textStyle(BOLD);textAlign(CENTER,CENTER);if(english){translate(width*.90,height*.5);rotate(HALF_PI);textSize(Math.min(height*.2,width*.21));text('NETIQUETTE',0,0)}else{textSize(Math.min(height*.26,width*.22));for(let i=0;i<4;i++)text('文明上网'[i],width*.88,height*(.12+i*.255))}pop();stroke(255,23);line(width*.946,height*.07,width*.946,height*.94);line(width*.78,height*.5,width*.94,height*.5);noStroke();
for(let j=-2;j<rows+2;j++){let v=j/rows,c=crest(v,t);for(let i=-3;i<cols*.80;i++){let u=i/cols,d=u-c,body=Math.exp(-Math.pow((d+.055)/.115,2)),edge=Math.exp(-Math.pow(d/.022,2));let turbulence=sin(v*65+t*2.8+u*19);let x=i*unit+body*width*.035+edge*width*.022*turbulence;let y=j*unit+body*unit*1.9*sin(v*32-u*20+t*1.8);let fade=1-smoothstep(.70,.80,u);let alpha=(25+body*85+edge*170)*fade;push();translate(x,y);rotate(body*.25*sin(v*37+t)+edge*.75*turbulence);scale(1+edge*.35,1+body*.22);fill(240,alpha);let bit=((i*17+j*31)%7)<3?'1':'0';text(bit,0,0);if(edge>.25){fill(255,edge*90);text(bit,unit*.20,-unit*.12)}pop()}}
// Thin foam filaments, pulled along the same contour as the character field.
noFill();for(let k=0;k<7;k++){stroke(255,12+k*2);strokeWeight(.5);beginShape();for(let y=0;y<=height;y+=5){let v=y/height;vertex(width*(crest(v,t)+.003*k+.003*sin(v*160+t*3+k)),y)}endShape()}noStroke();}
function smoothstep(a,b,x){let v=constrain((x-a)/(b-a),0,1);return v*v*(3-2*v)}
function windowResized(){resizeCanvas(windowWidth,windowHeight)}
function keyPressed(){if(key===' '){document.querySelector('#pause').click();return false}if(key==='f'||key==='F')fullscreen(!fullscreen());if(key==='l'||key==='L')english=!english;}
