// Procedural typography: every glyph follows a continuous, travelling tide field.
let phase=0,paused=false,english=false,glyphs=[],glyphUnit=0,speedControl;
function setup(){createCanvas(windowWidth,windowHeight);pixelDensity(1);frameRate(60);textFont('monospace');speedControl=document.querySelector('#speed');document.querySelector('#lang').onclick=()=>{english=!english;redraw()};document.querySelector('#pause').onclick=()=>{paused=!paused;document.querySelector('#pause').textContent=paused?'继续':'暂停';if(paused)noLoop();else loop()};document.querySelector('#full').onclick=()=>fullscreen(!fullscreen());document.querySelector('#save').onclick=()=>saveCanvas('information-tide','png');}
// Rasterize each character once; reuse bitmap stamps instead of shaping text per frame.
function buildGlyphs(unit){glyphUnit=unit;glyphs=['0','1'].map(bit=>{const c=document.createElement('canvas');c.width=c.height=Math.ceil(unit*2);const ctx=c.getContext('2d');ctx.fillStyle='#f0f0f0';ctx.font=`${unit*.91}px monospace`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(bit,c.width/2,c.height/2);return c})}
function crest(y,t){return .39+.23*sin(t*.46)+.038*sin(y*11+t*1.4)+.022*sin(y*27-t*2)+.011*sin(y*57+t*2.7)+.005*sin(y*117-t*3)}
function draw(){if(!paused)phase+=Math.min(deltaTime,50)*.001*Number(speedControl.value);background(6);const t=phase;const unit=Math.max(10,height/62),cols=Math.ceil(width/unit),rows=Math.ceil(height/unit);if(glyphUnit!==unit)buildGlyphs(unit);textSize(unit*.91);textAlign(CENTER,CENTER);noStroke();
// Low, silver water glow underneath the type.
for(let j=0;j<rows;j++){let y=j*unit,u=y/height,c=crest(u,t)*width;for(let k=-4;k<=4;k++){let a=Math.exp(-k*k/7)*3;fill(255,a);rect(c+k*unit*2,y,unit*2,unit+1)}}
// Right-hand monumental lettering is part of the water, like the reference.
push();fill(255,24);textFont('Arial');textStyle(BOLD);textAlign(CENTER,CENTER);if(english){translate(width*.90,height*.5);rotate(HALF_PI);textSize(Math.min(height*.225,width*.27));text('NETIQUETTE',0,0)}else{textSize(Math.min(height*.35,width*.38));for(let i=0;i<4;i++)text('文明上网'[i],width*.91,height*(.08+i*.28))}pop();stroke(255,23);line(width*.946,height*.07,width*.946,height*.94);line(width*.78,height*.5,width*.94,height*.5);noStroke();
const ctx=drawingContext;
for(let j=-2;j<rows+2;j++){const v=j/rows,c=crest(v,t),rowAngle=Math.sin(v*37+t)*.25;
for(let i=-3;i<cols*.80;i++){const u=i/cols,d=u-c,body=Math.exp(-(((d+.055)/.115)**2)),edge=Math.exp(-((d/.022)**2)),fade=1-smoothstep(.70,.80,u);if(fade<=0)continue;
const turbulence=Math.sin(v*65+t*2.8+u*19),x=i*unit+body*width*.035+edge*width*.022*turbulence,y=j*unit+body*unit*1.9*Math.sin(v*32-u*20+t*1.8),angle=body*rowAngle+edge*.75*turbulence;
const cs=Math.cos(angle),sn=Math.sin(angle),sx=1+edge*.35,sy=1+body*.22,g=glyphs[((i*17+j*31)%7)<3?1:0];
ctx.setTransform(cs*sx,sn*sx,-sn*sy,cs*sy,x,y);ctx.globalAlpha=Math.min(1,(25+body*85+edge*170)*fade/255);ctx.drawImage(g,-g.width/2,-g.height/2);
if(edge>.25){ctx.globalAlpha=edge*90/255;ctx.drawImage(g,-g.width/2+unit*.20,-g.height/2-unit*.12)}
}}ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
// Thin foam filaments, pulled along the same contour as the character field.
noFill();for(let k=0;k<7;k++){stroke(255,12+k*2);strokeWeight(.5);beginShape();for(let y=0;y<=height;y+=5){let v=y/height;vertex(width*(crest(v,t)+.003*k+.003*sin(v*160+t*3+k)),y)}endShape()}noStroke();}
function smoothstep(a,b,x){let v=constrain((x-a)/(b-a),0,1);return v*v*(3-2*v)}
function windowResized(){resizeCanvas(windowWidth,windowHeight);if(paused)redraw()}
function keyPressed(){if(key===' '){document.querySelector('#pause').click();return false}if(key==='f'||key==='F')fullscreen(!fullscreen());if(key==='l'||key==='L')english=!english;}
