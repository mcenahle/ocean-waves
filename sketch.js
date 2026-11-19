// Procedural typography: every glyph follows a continuous, travelling tide field.
let phase=0,paused=false,english=false,glyphs=[],glyphUnit=0,speedControl;
function setup(){createCanvas(windowWidth,windowHeight);pixelDensity(1);frameRate(60);textFont('monospace');speedControl=document.querySelector('#speed');document.querySelector('#lang').onclick=()=>{english=!english;redraw()};document.querySelector('#pause').onclick=()=>{paused=!paused;document.querySelector('#pause').textContent=paused?'继续':'暂停';if(paused)noLoop();else loop()};document.querySelector('#full').onclick=()=>fullscreen(!fullscreen());document.querySelector('#save').onclick=()=>saveCanvas('information-tide','png');}
// Rasterize each character once; reuse bitmap stamps instead of shaping text per frame.
function buildGlyphs(unit){glyphUnit=unit;glyphs=['0','1'].map(bit=>{const c=document.createElement('canvas');c.width=c.height=Math.ceil(unit*2);const ctx=c.getContext('2d');ctx.fillStyle='#f0f0f0';ctx.font=`${unit*.91}px monospace`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(bit,c.width/2,c.height/2);return c})}
// A periodic train advances rightwards: the next crest is already entering
// while its predecessor leaves. Periodic distance keeps the seam off the foam.
const WAVE_SPACING=.72;
// Three broad lobes down the screen; small harmonics retain the foam texture.
function crest(y,t){const a=y*Math.PI*2*3+t*1.4;return -.15+t*.105+.052*sin(a)+.008*sin(a*2+.5)+.003*sin(a*4-t*.4)}
function waveDistance(x,y,t){const d=x-crest(y,t);return d-WAVE_SPACING*Math.floor((d+.56)/WAVE_SPACING)}
function visibleCrests(y,t){const anchor=crest(0,t),base=anchor-WAVE_SPACING*Math.floor(anchor/WAVE_SPACING)+crest(y,t)-anchor;return [base-WAVE_SPACING,base,base+WAVE_SPACING,base+2*WAVE_SPACING]}
function draw(){if(!paused)phase+=Math.min(deltaTime,50)*.001*Number(speedControl.value);background(6);const t=phase;const unit=Math.max(10,height/62),cols=Math.ceil(width/unit),rows=Math.ceil(height/unit);if(glyphUnit!==unit)buildGlyphs(unit);textSize(unit*.91);textAlign(CENTER,CENTER);noStroke();
// Low, silver water glow underneath the type.
for(let j=0;j<rows;j++){let y=j*unit,u=y/height,centers=visibleCrests(u,t);for(const center of centers){let c=center*width;for(let k=-4;k<=4;k++){let a=Math.exp(-k*k/7)*3;fill(255,a);rect(c+k*unit*2,y,unit*2,unit+1)}}}
// Right-hand monumental lettering is part of the water, like the reference.
push();fill(255,24);textFont('Arial');textStyle(BOLD);textAlign(CENTER,CENTER);if(english){translate(width*.90,height*.5);rotate(HALF_PI);textSize(Math.min(height*.225,width*.27));text('NETIQUETTE',0,0)}else{textSize(Math.min(height*.35,width*.38));for(let i=0;i<4;i++)text('文明上网'[i],width*.91,height*(.08+i*.28))}pop();stroke(255,23);line(width*.946,height*.07,width*.946,height*.94);line(width*.78,height*.5,width*.94,height*.5);noStroke();
const ctx=drawingContext;
for(let j=-2;j<rows+2;j++){const v=j/rows,c=crest(v,t),rowAngle=Math.sin(v*22.2+t)*.25;
for(let i=-3;i<cols*.80;i++){const u=i/cols,d=waveDistance(u,v,t),body=Math.exp(-(((d+.085)/(d<-.085?.25:.12))**2))*smoothstep(-.56,-.46,d)*(1-smoothstep(.10,.16,d)),edge=Math.exp(-((d/.038)**2)),wake=Math.exp(-(((d+.27)/.17)**2))*smoothstep(-.56,-.46,d)*(1-smoothstep(-.045,.015,d)),fade=1-smoothstep(.70,.80,u);if(fade<=0)continue;
const turbulence=Math.sin(v*39+t*2.8+u*19),x=i*unit+body*width*.035+edge*width*.022*turbulence,y=j*unit+body*unit*1.9*Math.sin(v*19.2-u*20+t*1.8),angle=body*rowAngle+edge*.75*turbulence+wake*.13*Math.sin(v*27+t*2);
const cs=Math.cos(angle),sn=Math.sin(angle),sx=1+body*1.05+edge*.75+wake*.45,sy=1+body*.22,g=glyphs[((i*17+j*31)%7)<3?1:0];
ctx.setTransform(cs*sx,sn*sx,-sn*sy,cs*sy,x,y);ctx.globalAlpha=Math.min(1,(25+body*85+edge*150+wake*38)*fade/255);ctx.drawImage(g,-g.width/2,-g.height/2);
// Two offset glyphs form a broken, fading wake behind the right-moving crest.
// Reuse the same glyph bitmap and transform to keep the extra work bounded.
if(wake>.16){for(let echo=1;echo<=2;echo++){
ctx.globalAlpha=wake*(echo===1?.20:.095)*fade;
ctx.drawImage(g,-g.width/2-unit*echo*.85,-g.height/2+Math.sin(v*39+t+echo)*unit*.22);
}}
if(edge>.25){ctx.globalAlpha=edge*90/255;ctx.drawImage(g,-g.width/2+unit*.20,-g.height/2-unit*.12)}
}}ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
// Thin foam filaments, pulled along the same contour as the character field.
noFill();for(let wave=0;wave<4;wave++)for(let k=0;k<7;k++){stroke(255,12+k*2);strokeWeight(.5);beginShape();for(let y=0;y<=height;y+=5){let v=y/height;vertex(width*(visibleCrests(v,t)[wave]+.003*k+.003*sin(v*160+t*3+k)),y)}endShape()}noStroke();}
function smoothstep(a,b,x){let v=constrain((x-a)/(b-a),0,1);return v*v*(3-2*v)}
function windowResized(){resizeCanvas(windowWidth,windowHeight);if(paused)redraw()}
function keyPressed(){if(key===' '){document.querySelector('#pause').click();return false}if(key==='f'||key==='F')fullscreen(!fullscreen());if(key==='l'||key==='L')english=!english;}
