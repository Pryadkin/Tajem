'use strict';


const multiItemSlider = (function () {
  return function (selector) {

  let
    slider = document.querySelector(selector),
    sliderItem = document.querySelectorAll('.ps_slider_item'),
    control = document.querySelectorAll('.ps_slider_control'),
    wrapper = document.querySelector('.ps_slider_wrapper'),
    itemWidth = parseFloat(getComputedStyle(sliderItem[0]).width),
    slider_name = document.querySelector('.slider-name'),
    transform = 0,
    items = [],
    positionLeftItem = 0,
    middle = 2,
    interval = 0,
    config = {
      isCycling: true,
      direction: 'left',
      interval: 4000,
      pause: true
    };

    let cycle = function(direction) {
      if (!config.isCycling) {
        return;
      }
      interval = setInterval(function() {
        sliderMainFunk(direction);
      }, config.interval);
    };


    sliderItem.forEach(function(item, index){
      items.push({item: item, position: index, transform: transform, name: sliderItem[index].getAttribute('name'), post: sliderItem[index].getAttribute('post')});
    })
    console.log(items);

    let position = {
      getMinItem() {
        let indexItem = 0;
        items.forEach(function(item, index){
          if(item.position < items[indexItem].position){
            indexItem = index;
          }
        })
        return indexItem;
      },
      getMaxItem() {
        let indexItem = items.length - 1;
        items.forEach(function(item, index){
          if(item.position > items[indexItem].position){
            indexItem = index;
          }
        })
        return indexItem;
      },
      getMiddleItem(){
        if(middle > 5){
          return middle = 0;
        }
        if(middle < 0) {
          return middle = 5;
        }
        return middle
      },
      getMin(){
        return items[position.getMinItem()].position;
      },
      getMax(){
        return items[position.getMaxItem()].position;
      }
    };


  sliderItem[position.getMiddleItem()].classList.toggle('ps_slider_item_center');


  let sliderMainFunk = function(direction){
    sliderItem[position.getMiddleItem()].classList.toggle('ps_slider_item_center');

    if(direction === 'right'){
      positionLeftItem--;
      middle--;
      let index = position.getMaxItem();
      if(positionLeftItem < position.getMin()){
        items[index].position = position.getMin() - 1;
        items[index].transform -= (itemWidth) * items.length;
        sliderItem[index].style.transform = 'translateX(' +  items[index].transform + 'px)';
      }
      sliderItem[position.getMiddleItem()].classList.toggle('ps_slider_item_center');

      transform += itemWidth;

      setItemName(items[position.getMiddleItem()].name, items[position.getMiddleItem()].post);
    }

    if(direction === 'left'){
      positionLeftItem++;
      middle++;
      if(positionLeftItem + 4 > position.getMaxItem()){
        let index = position.getMinItem();
        items[index].position = position.getMax() + 1;
        items[index].transform += (itemWidth) * items.length;
        sliderItem[index].style.transform = 'translateX(' +  items[index].transform + 'px)';
      }
      sliderItem[position.getMiddleItem()].classList.toggle('ps_slider_item_center');

      transform -= itemWidth;

      setItemName(items[position.getMiddleItem()].name, items[position.getMiddleItem()].post);
    }
      wrapper.style.transform = 'translateX(' +  transform + 'px)';
  }

// Изменяем имя над каждым элементом слайдера
  let setItemName = function(itemName, itemPost){
    slider_name.children[0].innerHTML = itemName;
    slider_name.children[1].innerHTML = itemPost;
  }
  setItemName(items[position.getMiddleItem()].name, items[position.getMiddleItem()].post);



  let clickFunk = function(){
    let direction = this.classList.contains('ps_slider_control_right') ? 'right' : 'left';
    sliderMainFunk(direction);
    clearInterval(interval);
    cycle(config.direction);
  }

  let setListener = function(){
    control.forEach(function(item){
      item.addEventListener('click', clickFunk);
      item.addEventListener('mousedown', function(e){
        e.preventDefault();
      });
    });
    if (config.pause && config.isCycling) {
      slider.addEventListener('mouseenter', function () {
        clearInterval(interval);
      });
      slider.addEventListener('mouseleave', function () {
        clearInterval(interval);
        cycle(config.direction);
      });
  }

  }

  // инициализация
  setListener();
  cycle(config.direction);


  }
}());

const slider = multiItemSlider('.ps_slider');
