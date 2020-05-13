<template>
	<view class="page">
		<view class="btn" @click="modalShow=true">购买商品</view>
		<view  class="mask"  v-if="modalShow" @click.stop="modalShow=false"></view>
		<view class="modal"  v-if="modalShow">
			<view class="infoView">
				<image class="cover" src="/static/img.jpeg" mode=""></image>
				<view class="infoRight">
					<view class="name">MAC子弹头口红</view>
					<view class="stock">库存：{{stock}}</view>
					<view class="infoRightBottom">
						<view class="price">价格：¥ {{price}}</view>
						<view class="numberControl">
							<view class="reduce">-</view>
							<view class="num">1</view>
							<view class="add">+</view>
						</view>
					</view>
				</view>
			</view>
			<view class="skuView" v-for="(item,index) in skuArr" :key='index'>
				<view class="skuName">{{item.name}}</view>
				<view class="skuItemview">
					<view 
						class="skuItem" 
						v-for="(item2,index2) in item.values" 
						@click="chooseSku(index,index2, item2.disabled)"
						:class="[(item2.checked && !item2.disabled)?'active':'', item2.disabled ? 'disabled':'']" 
						:key='index2'>{{item2.value}}</view>
				</view>
			</view>
			<view class="btn">立即购买</view>
		</view>
	</view>
</template>

<script>
	import util from '../../utils/index.js';
	export default {
		data() {
			return {
				skuArr: [],
				specArr: [],
				chooseSkuObj: {},
				choosesSkuArr: [],
				stock: 0,
				price: 0,
				modalShow: false
			}
		},
		onLoad() {
			var arr = [1, 1], arr2 = ["", 1];
			this.getDetails();
		},
		methods: {
			// 获取详情，实际开发中为ajax请求，这里直接从本地缓存种取得
			getDetails(){
				let skuArr = uni.getStorageSync('skuArr'), specArr = uni.getStorageSync('specArr');
				skuArr.forEach(item=>{
					item.values.forEach(item2=>{
						item2.checked = false;
						item2.disabled = false;
					})
				})
				specArr.forEach((item, index)=>{
					console.log()
					item.arr = [];
					for(let k in item.spec_index_obj){
						item.arr.push(item.spec_index_obj[k]);
					}
				})
				this.skuArr = skuArr;
				this.specArr = specArr;
				
			},
			// 点击规格按钮
			chooseSku(currentIndex, currentIndex2, isDiabled){
				if(isDiabled) return;
				this.chooseSkuObj[currentIndex] = currentIndex2;
				this.choosesSkuArr[currentIndex] = currentIndex2;
				this.skuArr.forEach((m, n)=>{
					m.values.forEach((j, k)=>{
						if(currentIndex==n){
							j.checked = false;
						}
						j.disabled = false;
					})
				})
				// this.skuArr[currentIndex].values.forEach(item=>{
				// 	item.disabled = false;
				// 	item.checked = false;
				// })
				this.skuArr[currentIndex].values[currentIndex2].checked = true;
				let stock = 0, priceArr = [], emptyStockSku = [];
				this.specArr.forEach((item, index)=>{
					if(util.isObjEqual(Object.assign({}, item.spec_index_obj, this.chooseSkuObj), Object.assign({}, item.spec_index_obj))){
						if(item.stock<=0 && this.choosesSkuArr.length==(this.skuArr.length-1)){
							emptyStockSku.push(item.spec_index_obj);
						}
						stock += Number(item.stock);
						priceArr.push(item.price);
					}
				})
				emptyStockSku.length && emptyStockSku.map(item=>{
					for(var k in item){
						if(!this.chooseSkuObj.hasOwnProperty(k)){
							console.log(k, item[k])
							console.log('=====');
							this.skuArr[k].values[item[k]].disabled = true;
						}
					}
				})
				console.log(this.skuArr);
				
				this.stock = stock;
				if(priceArr.length==1){
					this.price = priceArr[0];
				}else{
					this.price = `${Math.min(...priceArr)}-${Math.max(...priceArr)}`;
				}
			}
		}
	}
</script>

<style lang="scss"  scoped>
	page{
		background-color: #f7f7f7;
		font-size: 28upx;
	}
	.page{
		.mask{
			width: 100%;
			height: 100vh;
			background-color: rgba(0,0,0,0.6);
			position: fixed;
			z-index: 10;
			top: 0;
			left: 0;
		}
		.btn{
			width: 690upx;
			height: 90upx;
			background-color: #409eff;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 10upx;
			color: white;
		}
		.modal{
			width: 100%;
			height: auto;
			max-height: 100vh;
			overflow-y: scroll;
			position: fixed;
			bottom: 0;
			left: 0;
			padding: 30upx;
			box-sizing: border-box;
			background-color: white;
			z-index: 20;
			.infoView{
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				height: auto;
				border-bottom: 1rpx solid #dddddd;
				padding-bottom: 30upx;
				box-sizing: border-box;
				.cover{
					width: 200upx;
					height: 200upx;
					margin-right: 20upx;
				}
				.infoRight{
					flex: 1 auto;
					height: 200upx;
					display: flex;
					justify-content: space-between;
					flex-direction: column;
					.name{
						font-weight: bold;
						font-size: 32upx;
					}
					.stock{
						color: #666;
					}
					.infoRightBottom{
						display: flex;
						align-items: center;
						justify-content: space-between;
						.numberControl{
							display: flex;
							align-items: center;
							.reduce,.add{
								width: 60upx;
								height: 45upx;
								background-color: #007AFF;
								text-align: center;
								line-height: 45upx;
								font-size: 30upx;
								color: white;
								border-radius: 10upx;
							}
							.num{
								padding: 0 15upx;
							}
						}
					}
				}
			}
			.skuView{
				width: 100%;
				height: auto;
				padding: 30upx 0;
				box-sizing: border-box;
				&:last-of-type{
					margin-bottom: 0;
				}
				.skuName{
					font-size: 30upx;
					line-height: 60upx;
				}
				.skuItemview{
					display: flex;
					flex-wrap: wrap;
					margin-top: 10upx;
					.skuItem{
						width: auto;
						height: 50upx;
						padding: 0 20upx;
						margin-right: 20upx;
						display: inline-flex;
						display: flex;
						align-items: center;
						justify-content: center;
						border: 1px solid #dcdfe6;
						border-radius: 20upx;
					}
					.active{
						background-color: #409eff;
						color: white;
					}
					.disabled{
						background-color: #f5f5f5;
						color: #ccc;
					}
				}
			}
		}
	}
</style>
