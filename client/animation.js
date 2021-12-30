
export class Loading {
  constructor(container, div1, div2, div3, div4){
    this.container = container;
    this.div1 = div1;
    this.div2 = div2;
    this.div3 = div3;
    this.div4 = div4;
    this.id = null;
  }

  animationStart () {
    this.container.style.height = '500px';
    this.container.style.width = '500px';
    this.container.style.padding = '10px';
    this.container.style.display = 'flex';
    this.container.style.justifyContent = 'center';
    this.container.style.alignItems = 'center';

    this.div1.style.width = '25px';
    this.div1.style.height = '25px';
    this.div1.style.background = 'rgba(0,0,0,0.5)';
    this.div1.style.margin = '5px';
    this.div1.style.borderRadius = '50%';

    this.div2.style.width = '25px';
    this.div2.style.height = '25px';
    this.div2.style.background = 'rgba(0,0,0,0.5)';
    this.div2.style.margin = '5px';
    this.div2.style.borderRadius = '50%';
    
    this.div3.style.width = '25px';
    this.div3.style.height = '25px';
    this.div3.style.background = 'rgba(0,0,0,0.5)';
    this.div3.style.margin = '5px';
    this.div3.style.borderRadius = '50%';
    
    this.div4.style.width = '25px';
    this.div4.style.height = '25px';
    this.div4.style.background = 'rgba(0,0,0,0.5)';
    this.div4.style.margin = '5px';
    this.div4.style.borderRadius = '50%';

    let i = 0;
    let divs = [this.div1, this.div2, this.div3, this.div4];


    this.id = setInterval(frame, 700);

    let n = 0;
    function frame() {
      console.log(n);
      let k = 0;
      let asa = setInterval(smooth, 30);
      function smooth() {
        divs[i].style.background = 'rgba(0,0,0,0.8)';
        if( k < 13){
          divs[i].style.height = 25 + k + 'px';
          divs[i].style.width = 25 + k + 'px';
          if(i === 0){
            divs[divs.length - 1].style.height = (38 - k) + 'px';
            divs[divs.length - 1].style.width = (38 - k) + 'px';
            divs[divs.length - 1].style.background = 'rgba(0,0,0,0.5)';
          }else if(i > 0){
            divs[i - 1].style.height = (38 - k) + 'px';
            divs[i - 1].style.width = (38 - k) + 'px';
            divs[i - 1].style.background = 'rgba(0,0,0,0.5)';
          }
          k += 1;
        }else {
          clearInterval(asa);
        }
        n = 1;
      }
      if(n === 1){
        if(i < divs.length - 1){
          i += 1;
        }else {
          i = 0;
        }
      }
    }


    return 'Uspesno';
  }

  animationEnd() {
    this.container.style.display = 'none';
  }


}
