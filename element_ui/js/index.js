/**
 * Created by nantian on 2017/8/1.
 */
var table = new Vue({
    el: '#app',
    template:'#mytemp',
    data: {
        currentPage: 1,
        page_sizes:[4,8,10],
        page_size:4,
        data_o:[],
        enableDelete:false,
        multipleSelection:[],
        dialogVisible:false,
        formData: {
            name: '',
            province: '',
            date: '',
            city: '',
            address: '',
            zip: '',
            id:false
        },
        cols:[
            {prop:"date", label:"日期", width:150, fixed:true},
            {prop:"name", label:"姓名", width:180, fixed:false},
            {prop:"province", label:"省份", width:180, fixed:false},
            {prop:"city", label:"市区", width:180, fixed:false},
            {prop:"address", label:"地址", width:350, fixed:false},
            {prop:"zip", label:"邮编", width:180, fixed:false}
        ],
        value5: ["date","name","province","city","address","zip"]
    },
    methods: {
        editRow:function(s,d) {
            var me = this;
            $.each(s.row,function(i,v){
                me.formData[i] = v;
            });
            this.dialogVisible = true;
        },
        handleSizeChange:function(val) {
            this.page_size = val;
        },
        handleCurrentChange:function(val) {
            this.currentPage = val;

        },
        handleSelectionChange:function(val) {
            this.multipleSelection = val;
            if(val.length){
                this.enableDelete = true;
            }else{
                this.enableDelete = false;
            }
        },
        onSubmit:function() {
            var me = this;
            if(typeof(this.formData.date) == 'object'){
                this.formData.date = this.formData.date.toLocaleDateString();
            }
            $.post('data/data_set.php',{
                data:JSON.stringify(this.formData)
            },function(data){
                me.data_o = data;
                me.dialogVisible = false;
            },'json')
        },
        deleteRow:function(row){
            var id = row.id;
            var me = this;
            this.$confirm('此操作将永久删除所选记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                $.post("data/data_delete.php",{
                    ids:JSON.stringify([id])
                },function(data){
                    me.data_o = data;
                },'json');
            }).catch(function(){
                me.$message({
                    type: 'info',
                    message: '已取消删除!'
                });
            });
        },
        deleteRows:function(){
            var me = this;
            this.$confirm('此操作将永久删除所选记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                var ids = [];
                $.each(me.multipleSelection,function(i,v){
                    ids.push(v.id);
                });
                $.post("data/data_delete.php",{
                    ids:JSON.stringify(ids)
                },function(data){
                    me.data_o = data;
                    me.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                },'json');
            }).catch(function(){
                me.$message({
                    type: 'info',
                    message: '已取消删除!'
                });
            });
        },
        addRow:function(){
            this.dialogVisible = true;
            this.formData = {
                name: '',
                province: '',
                date: '',
                city: '',
                address: '',
                zip: '',
                id:false
            }
        }
    },
    computed:{
        tableData:function(){
            var dData = [];
            var me = this;
            $.each(this.data_o,function(i,v){
                if(i<me.page_size*me.currentPage && i>=me.page_size*(me.currentPage-1)){
                    dData.push(v);
                }
            });
            return dData
        },
        total:function(){
            return this.data_o.length;
        }
    },
    beforeCreate:function(){
        var me = this;
        $.get('data/data_get.php',function(data){
            me.data_o = data;
        },"json");
    }
});