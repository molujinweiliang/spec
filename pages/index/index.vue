<template>
	<view class="content">
		<template v-if="step==1">
			<view class="item" v-for="(item,index) in skuArr" :key='index'>
				<view class="form_item">
					<view class="left">名称：</view>
					<view class="right">
						<input class="input" v-model="item.name" type="text" placeholder="请输入规格名称,如颜色,大小等" />
					</view>
				</view>
				<view class="form_item" v-for="(item2, index2) in item.values" :key='index2'>
					<view class="left"></view>
					<view class="right">
						<input class="input" v-model="item2.value" type="text" placeholder="请输入规格值" />
					</view>
				</view>
				<view class="form_item">
					<view class="left"></view>
					<view class="right">
						<view class="add" @click="addValue(index)">增加规格值</view>
					</view>
				</view>
			</view>
			<view class="add" @click="add">增加规格</view>
			<button @click="makeSku">生成规格组合并填写库存价格</button>
		</template>
		<template v-if="step==2">
			<view class="item" v-for="(item, index) in specArr"  :key='index'>
				<view class="form_item">
					<view class="left">规格组合：</view>
					<view class="right">
						<view class="input">{{item.spec_name}}</view>
					</view>
				</view>
				<view class="form_item">
					<view class="left">价格：</view>
					<view class="right">
						<input class="input" v-model="item.price" type="text" placeholder="请输入价格" />
					</view>
				</view>
				<view class="form_item">
					<view class="left">库存：</view>
					<view class="right">
						<input class="input" v-model="item.stock" type="text" placeholder="请输入库存" />
					</view>
				</view>
				<!-- 可以增加上传图片 -->
				<!-- <view class="form_item">
					<view class="left">图片：</view>
					<view class="right">
						<image :src="item.image" mode=""></image>
					</view>
				</view> -->
			</view>
			<button @click="save">上传</button>
		</template>
	</view>
</template>

<script>
	// 笛卡尔积算法
	import util from '../../utils/index.js';
	export default {
		data() {
			return {
				arr: [1,2,3,4,5],
				skuArr: [{
					name: '颜色',
					values: [
						{
							value: '红色',
						},
						{
							value: '白色',
						}
					],
				},
				// {
				// 	name: '内存',
				// 	values: [
				// 		{
				// 			value: '64G',
				// 		},
				// 		{
				// 			value: '128G',
				// 		}
				// 	],
				// },
				{
					name: '大小',
					values: [
						{
							value: '大',
						},
						{
							value: '小',
						}
					],
				}],
				step: 1,
				specArr: [
					// {
					// 	spec_name: '颜色：红色 大小：大',
					// 	spec_index_obj: {
					// 		0: 0,
					// 		1: 0,
					// 	},
					// 	price: 0,
					// 	stock: 0,
					// 	image: '',
					// }
				],
			}
		},
		computed:{
			allSkuArr(){
				let allSkuArr = [];
				this.skuArr.map((item, index)=>{
					let oneSkuArr = [];
					item.values.map((item2, index2)=>{
						// let obj = [];
						// obj[index] = index2;
						oneSkuArr.push(index2);
					})
					allSkuArr.push(oneSkuArr);
				})
				return allSkuArr;
			}
		},
		onLoad() {

		},
		methods: {
			addValue(index) {
				this.skuArr[index].values.push({
					value: '',
				})
			},
			add() {
				this.skuArr.push({
					name: '',
					values: [{
						value: '',
					}, ],
				})
			},
			makeSku(){
				// 这里就不做表单验证了，根据项目需要去做验证
				let  specArr = [];
				util.cartesian(this.allSkuArr).length && util.cartesian(this.allSkuArr).map((item, index)=>{
					let obj = {
						spec_name: '',
						spec_index_obj: {},
						price: 0,
						stock: 0,
						image: '',
					};
					item.map((item2, index2)=>{
						let spec_obj = {};
						obj.spec_name += `${this.skuArr[index2].name}:${this.skuArr[index2].values[item2].value} ` ;
						spec_obj[index2] = item2;
						obj.spec_index_obj = Object.assign(obj.spec_index_obj, spec_obj);
					})
					specArr.push(obj);
				})
				console.log(specArr);
				this.specArr = specArr;
				this.step = 2;
			},
			// 上传该商品 sku，这里我用本地存储替代请求
			save(){
				// 这里就不做表单验证了，根据项目需要去做验证
				uni.setStorageSync('specArr', this.specArr);
				uni.setStorageSync('skuArr', this.skuArr);
				uni.navigateTo({
					url:  '/pages/goods/details'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	page {
		background-color: #f7f7f7;
		font-size: 28upx;

		.item {
			width: 100%;
			padding: 20upx;
			box-sizing: border-box;
			height: auto;
			background-color: white;
			margin-top: 10upx;
			.form_item {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 80upx;

				.left {
					width: 200upx;
				}

				.right {
					flex: 1 auto;

					.input {
						text-align: center;
						background-color: #dddddd;
					}
				}
			}
		}

		.add {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 50upx;
			margin-top: 30rpx;
			color: blue;
		}
	}
</style>
