// 数据存储容器
var tags = []; //标签
var isTags = 1; // 默认打开第一项菜单
var isType = 'tripod'; //默认是三脚架数据
var tripodData = []; //三脚架产品信息
var washerData = []; //洗衣机产品信息

//在menu.json文件里获取标签菜单
function getTags(tags, callback) {
    // 使用$.getJSON()方法获取JSON数据
    $.getJSON('json/menu.json', function (data) {
        callback(data.menu); // 把数据传递给回调函数
    }).fail(function (error) {
        $('#loading').html('<div class="alert alert-danger">加载数据失败，请联系技术人员！</div>');
    });
}

//获取三脚架页面数据对象
function getTripodData(tripodData, callback) {
    // 使用$.getJSON()方法获取JSON数据
    $.getJSON('json/tripodData.json', function (data) {
        callback(data); // 把数据传递给回调函数
    }).fail(function (error) {
        $('#loading').html('<div class="alert alert-danger">加载数据失败，请联系技术人员！</div>');
    });
}

//获取洗衣机页面数据对象
function getWasherData(washerData, callback) {
    // 使用$.getJSON()方法获取JSON数据
    $.getJSON('json/washerData.json', function (data) {
        callback(data); // 把数据传递给回调函数
    }).fail(function (error) {
        $('#loading').html('<div class="alert alert-danger">加载数据失败，请联系技术人员！</div>');
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {

    //获取登录信息
    let userNmae = localStorage.getItem('user');

    if (!userNmae) {//未登录，请登录
        alert("非法访问,请登录！");
        window.location.href = './index.html';
    }

    //调用获取标签内容
    getTags(tags, function (menu) {
        tags = menu
        loadTags(tags); // 在这里加载标签
    });


    //调用获取三脚架页面数据
    getTripodData(tripodData, function (data) {
        tripodData = data;
        // 加载文本内容
        loadTextContent(tripodData, isTags, tripodData.code);
        // 加载图片
        loadImages(tripodData, isTags, tripodData.code);
    });

    //调用获取洗衣机页面数据
    getWasherData(washerData, function (data) {
        washerData = data;

        // 加载文本内容
        loadTextContent(washerData, isTags, washerData.code);
        // 加载图片
        loadImages(washerData, isTags, washerData.code);
    });




    // 设置图片点击事件
    setupImageClickEvent();

    // 设置模态框关闭事件
    setupModalCloseEvent();

    //搜索数据函数
    onButtContent();
});

// 加载标签函数
function loadTags(tagDatas) {
    // 获取标签位置
    const tagsContainer = document.getElementById('tags-container');

    // 清空加载状态
    tagsContainer.innerHTML = '';

    // 添加标签
    tagDatas.forEach((tag, index) => {
        const tagElement = document.createElement('a');
        tagElement.href = '#';
        tagElement.className = `tag-item ${index === 0 ? 'active' : ''}`;
        tagElement.textContent = tag.content;

        // 添加点击事件
        tagElement.addEventListener('click', function (e) {
            e.preventDefault();

            // 移除所有标签的active类
            document.querySelectorAll('.tag-item').forEach(item => {
                item.classList.remove('active');
            });

            // 为当前点击的标签添加active类
            this.classList.add('active');

            //设置当前标签位置
            isTags = tag.id;
            //设置当前产品类型
            isType = tag.type;
            // 标签切换，获取不同的数据
            if ('tripod' === isType) { //三脚架
                loadTextContent(tripodData, isTags, isType);
                loadImages(tripodData, isTags, isType);
            } else if ('washer' === isType) { //洗衣机
                loadTextContent(washerData, isTags, isType);
                loadImages(washerData, isTags, isType);
            }

        });

        tagsContainer.appendChild(tagElement);
    });
}

// 加载文本内容函数
function loadTextContent(datas, isTags, isType) {
    const textContainer = document.getElementById('text-container');

    // 显示加载状态
    textContainer.innerHTML =
        `
                    <div class="loader">
                        <div class="spinner"></div>
                    </div>
                    `;
    let contentHTML = ''; // 创建空字符串用于累积内容

    if ('tripod' === datas.code) {
        setTimeout(() => {
            loadContents(datas, isTags, contentHTML, textContainer);
        }, 1000);
    } else if ('washer' === datas.code) {
        loadContents(datas, isTags, contentHTML, textContainer);
    }
}

//加载内容是概述还是术语亦或者是成本
function loadContents(datas, isTags, contentHTML, textContainer) {
    const title = document.getElementById('title');
    const showHide = document.getElementById('showHide');
    const contentImg = document.getElementById('contentImg');
    const titleImg = document.getElementById('titleImg');
    const search = document.getElementById('search');

    switch (isTags) {
        case 1:
        case 4:
            showHide.style.display = 'block';
            contentImg.style.display = 'none';
            search.style.display = 'block';

            title.innerText = '产品概述';
            //遍历产品数据
            datas.overviews.forEach((overview, index) => {
                //校验当前的产品id
                if (overview != undefined && overview.type === isTags) {
                    //页面数据渲染拼接
                    contentHTML +=
                        `<div class="text-content">
                    ${overview.content}
                </div>
                `;
                }
                if (overview == undefined) {
                    $('#loading').html('<div class="alert alert-danger">该标签里没有对应信息/(ㄒoㄒ)/~~</div>');
                }

            });
            // 循环结束后一次性设置innerHTML
            if (contentHTML === '') {
                // 没有符合条件的数据时的处理
                textContainer.innerHTML = '<div class="alert alert-info">没有找到匹配的内容</div>';
            } else {
                // 清空加载状态
                textContainer.innerHTML = '';
                textContainer.innerHTML = contentHTML;
            }
            break;
        case 2:
        case 5:
            search.style.display = 'block';
            showHide.style.display = 'block';
            contentImg.style.display = 'none';
            title.innerText = '产品话术';
            //遍历产品数据
            datas.terms.forEach((overview, index) => {
                //校验当前的产品id
                if (overview != undefined && overview.type === isTags) {
                    //页面数据渲染拼接
                    contentHTML +=
                        `<div class="text-content">
                    ${overview.content}
                </div>
                `;
                }
                if (overview == undefined) {
                    $('#loading').html('<div class="alert alert-danger">该标签里没有对应信息/(ㄒoㄒ)/~~</div>');
                }

            });
            // 循环结束后一次性设置innerHTML
            if (contentHTML === '') {
                // 没有符合条件的数据时的处理
                textContainer.innerHTML = '<div class="alert alert-info">没有找到匹配的内容</div>';
            } else {
                // 清空加载状态
                textContainer.innerHTML = '';
                textContainer.innerHTML = contentHTML;
            }
            break;
        case 3:
        case 6:
            //图片
            titleImg.innerText = '产品图片'
            showHide.style.display = 'none';
            contentImg.style.display = 'block';
            search.style.display = 'none';
            loadImages(datas, isTags, isType);
            break;
        case 7:
        case 8:
            console.log("数据：",datas);
            
            search.style.display = 'block';
            showHide.style.display = 'block';
            contentImg.style.display = 'none';
            title.innerText = '产品成本';
            //遍历产品数据
            datas.cost.forEach((cost, index) => {
                //校验当前的产品id
                if (cost != undefined && cost.type === isTags) {
                    //页面数据渲染拼接
                    contentHTML +=
                        `<div class="text-content">
                    ${cost.content}
                </div>
                `;
                }
                if (cost == undefined) {
                    $('#loading').html('<div class="alert alert-danger">该标签里没有对应信息/(ㄒoㄒ)/~~</div>');
                }

            });
            // 循环结束后一次性设置innerHTML
            if (contentHTML === '') {
                // 没有符合条件的数据时的处理
                textContainer.innerHTML = '<div class="alert alert-info">没有找到匹配的内容</div>';
            } else {
                // 清空加载状态
                textContainer.innerHTML = '';
                textContainer.innerHTML = contentHTML;
            }
            break;
        default:
            $('#loading').html('<div class="alert alert-danger">该标签里没有对应信息/(ㄒoㄒ)/~~</div>');
    }
}

// 加载图片函数
function loadImages(mockData, isTags, isType) {
    const imagesContainer = document.getElementById('images-container');

    // 显示加载状态
    imagesContainer.innerHTML = `
<div class="loader col-span-2">
  <div class="spinner"></div>
</div>
`;

    let contentHTML = ''; // 创建空字符串用于累积内容

    //遍历产品数据
    mockData.imgs.forEach((data, index) => {
        if (data == undefined) {
            $('#loading').html('<div class="alert alert-danger">该标签里没有对应信息/(ㄒoㄒ)/~~</div>');
        }
        //校验当前的产品id
        if (data != undefined && data.type === isTags) {
            //页面数据渲染拼接
            const imageElement = document.createElement('div');
            imageElement.className = 'image-item';
            contentHTML += `
    <img src="${data.imgUrl}" alt="imgContent" data-id="${data.type}" loading="lazy">
  `;
            imagesContainer.appendChild(imageElement);
        }

    });
    // 循环结束后一次性设置innerHTML
    if (contentHTML === '') {
        // 没有符合条件的数据时的处理
        imagesContainer.innerHTML = '<div class="alert alert-info">没有找到匹配的内容</div>';
    } else {
        // 清空加载状态
        imagesContainer.innerHTML = '';
        imagesContainer.innerHTML = contentHTML;

    }

    // 重新设置图片点击事件
    setupImageClickEvent();

}

// 设置图片点击事件
function setupImageClickEvent() {
    const imageItems = document.querySelectorAll('.image-grid img');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');

    imageItems.forEach(img => {
        img.addEventListener('click', function () {
            modal.style.display = 'flex';
            modalImage.src = this.src.replace('/400/400', '/800/800');
            modalImage.alt = this.alt;

            // 禁止背景滚动
            document.body.style.overflow = 'hidden';
        });
    });
}

// 设置模态框关闭事件
function setupModalCloseEvent() {
    const modal = document.getElementById('imageModal');
    const closeBtn = document.getElementById('closeModal');

    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';

        // 恢复背景滚动
        document.body.style.overflow = '';
    });

    // 点击模态框背景也可以关闭
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // 添加ESC键关闭模态框
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

// 点击搜索按钮进行检索数据
function onButtContent() {
    $("#buttContent").click(function () {
        let textContainer = $('#text-container');
        let msg = $('#msg').val();
        switch (isTags) {
            //三脚架数据
            case 1:
                //概述
                searchContent(tripodData, textContainer, msg);
                break;
            case 2:
                //术语
                searchTerms(tripodData, textContainer, msg);
                break;
            //洗衣机数据
            case 4:
                //概述
                searchContent(washerData, textContainer, msg);
                break;
            case 5:
                //术语
                searchTerms(washerData, textContainer, msg);
                break;
            default:
                alert("该位置不在此维度，请联系技术人员处理!")
                break;
        }

    })
}

// 概述数据条件筛选渲染
function searchContent(datas, textContainer, msg) {
    let contents = ''; //拼接，多个结果
    for (let index = 0; index < datas.overviews.length; index++) {
        let elementText = datas.overviews[index].content;
        if (elementText.indexOf(msg) != -1) {
            //页面数据渲染拼接
            contents +=
                `<div class="text-content">
                    ${elementText}
                </div>`;
        }

    }
    //清空当前数据
    textContainer.empty();
    //渲染筛选数据
    textContainer.append(contents);
}

// 术语数据条件筛选渲染
function searchTerms(datas, textContainer, msg) {
    let contents = ''; //拼接，多个结果
    for (let index = 0; index < datas.terms.length; index++) {
        let elementText = datas.terms[index].content;
        if (elementText.indexOf(msg) != -1) {
            //页面数据渲染拼接
            contents +=
                `<div class="text-content">
                    ${elementText}
                </div>`;
        }

    }
    //清空当前数据
    textContainer.empty();
    //渲染筛选数据
    textContainer.append(contents);
}
