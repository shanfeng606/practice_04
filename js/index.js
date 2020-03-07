(function (window, document) {
    //选择器方法
    const qs = {
        $(ele, parent = document) {
            return parent.querySelector(ele);
        },
        $all(ele, parent = document) {
            return parent.querySelectorAll(ele);
        },
        appendChild(parent, ...child) {
            child.forEach(element => {
                parent.appendChild(element);
            })
        }
    }

    //定义构造函数
    function Selector(option) {
        this._init(option);
        this.getContent();
        this.list();
        this.bind();
    }

    //初始化
    Selector.prototype._init = function ({ content, items, search, out }) {
        this.content = qs.$(content);
        this.items = qs.$(items);
        this.searchBar = qs.$(search);
        this.out = qs.$(out);
        this.shown = false;   //之前false
        this.demoOptions = {};
        this.curliIndex = undefined;
        this.shownHeight = '';
        this.items.style.display = 'none';//none
        this.items.style.height = 0;
        this.content.innerHTML = '未选择';
    }

    //显示、隐藏功能
    Selector.prototype.showhide = function (ele) {
        if (this.shown) {
            this.shownHeight = ele.style.height;
            ele.style.height = 0;
            setTimeout(() => {
                ele.style.display = 'none';

            }, 0)
            this.shown = false;
        } else {
            ele.style.display = 'block';
            setTimeout(() => {
                ele.style.height = this.shownHeight ;

            })
            this.shown = true;
        }
    }

    //搜索框搜索功能 
    Selector.prototype.search = function (value) {
        let reg = new RegExp(value, 'ig')
        for (let i = 0; i < this.curLi.length; i++) {
            if (!value) {
                this.curLi[i].style.display = 'block';
            }
            else if (reg.test(this.curLi[i].innerText)) {
                this.curLi[i].style.display = 'block';
            } else {
                this.curLi[i].style.display = 'none';
            }
        }
        if (this.ul.offsetHeight < 200) {
            this.items.style.height = this.ul.offsetHeight + 60 + 'px';
        } else {
            this.items.style.height = '200px';
        }

    }

    //获取原生select内容
    Selector.prototype.getContent = function () {
        let options = qs.$all('option', qs.$('#demo'));  //获取demo下所有option
        for (let i = 0; i < options.length; i++) {
            if (!this.demoOptions.hasOwnProperty(options[i].getAttribute('type'))) {
                this.demoOptions[options[i].getAttribute('type')] = [];  //没有类 就新建的数组 比如 "构建工具"=[]
                this.demoOptions[options[i].getAttribute('type')].push(options[i].innerHTML);
            } else {
                this.demoOptions[options[i].getAttribute('type')].push(options[i].innerHTML);
            }
        }
    }
    
    //生成下拉列表选项
    Selector.prototype.list = function () {
        let ul = document.createElement('ul');
        let ulInner = '';
        for (i in this.demoOptions) {
            let div = `<div>${i}</div>`;
            let li = '';
            for (let j = 0; j < this.demoOptions[i].length; j++) {
                li += `
            <li>${this.demoOptions[i][j]}</li>
        `
            }
            ulInner += div + li;

        }
        ul.innerHTML = ulInner;
        qs.appendChild(qs.$('.result'), ul);

    }
    
    //绑定事件
    Selector.prototype.bind = function () {
        
        //点击选择框显示隐藏事件
        let sel = qs.$('.selector');
        sel.addEventListener('click', (e) => {
            e.stopPropagation();  //阻止冒泡
            if (e.target.id === 'search') { return }
            this.showhide(this.items);
        });

        //选择选项后显示文字事件
        this.ul = qs.$('ul', qs.$('.result'));
        this.curLi = qs.$all('li', this.ul);
        let self = this;
        this.curLi.forEach((curli, index) => {
            curli.addEventListener('click', function (e) {
                e.stopPropagation();
                self.showhide(self.items);
                let beforeVal = self.content.innerText;
                let beforeIndex = self.curliIndex;
                self.content.innerText = this.innerText;
                self.curliIndex = index + 1;
                self.out.innerHTML = `之前的值是 ${beforeVal} - ${beforeIndex}<br>
                    改变后的值是 ${self.content.innerText} - ${self.curliIndex}
                `
                for (i = 0; i < self.curLi.length; i++) {
                    self.curLi[i].className = '';
                }
                this.className = 'mousedown';    //这个样式起什么作用？
            })

        })
        //点击外侧隐藏下拉列表
        document.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.shown) {
                this.showhide(this.items);
            }

        })
        //搜索框输入监听事件
        this.searchBar.addEventListener('keyup', () => {
            let value = this.searchBar.value;
            this.search(value);
        })

    }
    //全局变量
    window.selector = Selector;
})(window, document)


//实例化
new selector({
    items: '.selector-items',
    content: '#selector-content',
    search: '.selector-search',
    out: '#out'




})


