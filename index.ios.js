/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ListView,
  View,
} = React;

var newData = [];

var AwesomeProject = React.createClass({
  clearText() {
    this._textInput.setNativeProps({text: ''});
    //this._textInput.focus();
    setTimeout(this._textInput.focus,100);
  },
  getInitialState: function() {
    return {      
      dataText: new ListView.DataSource({
        rowHasChanged: (row1, row2) => true,
      }),
      isBottomDialog:false,
      isAll:true,
      isActive:false,
      isCompleted:false,
      isCheckAll:false,
      eventLog: [],
    };
  },
  submitLabel: function(event){
    if(event.nativeEvent.text != ''){
      newData.push({inputData:event.nativeEvent.text,checkData:false,istTextChange:false,});
      this.setState({
        dataText: this.state.dataText.cloneWithRows(newData),
        isBottomDialog: true,
        isCheckAll:false,
      });
      this.clearText();
    }
  },
  delText: function(index){
    newData.splice(index,1);
    this.setState({
      dataText: this.state.dataText.cloneWithRows(newData),
    });
    if(newData.length==0){
      this.setState({
        isBottomDialog:false,
      });
    }
    
  },
  clearCheck: function(){
    var newsData=newData.concat();
    newData.splice(0);
    for(var i=0;i!=newsData.length;++i){
        if(!newsData[i].checkData){
            newData.push(newsData[i]);
        }
    }
    this.setState({
        dataText: this.state.dataText.cloneWithRows(newData),
    });
    if(newData.length==0){
      this.setState({
        isBottomDialog:false,
      });
    }
  },
  checkChange: function(index){
    newData[index].checkData = !newData[index].checkData;
    if(this.state.isActive){
      this.showActive();
    }else if(this.state.isCompleted){
      this.showCompleted();
    }else{
      this.setState({
        dataText: this.state.dataText.cloneWithRows(newData),
      });
    }

  },
  showAll:function(){
    var allData = [];
    for(var i=0;i!=newData.length;++i){
      allData.push(newData[i]);
    }
    this.setState({
        dataText: this.state.dataText.cloneWithRows(allData),
        isAll:true,
        isActive:false,
        isCompleted:false,
    });
  },
  showActive:function(){
    var allActive = [];
    console.log(newData);
    for(var i=0;i!=newData.length;++i){
      if(!newData[i].checkData){
        allActive.push(newData[i]);
      }else{
        allActive.push({inputData:'',checkData:'',istTextChange:'',});
      }
    }
    this.setState({
        dataText: this.state.dataText.cloneWithRows(allActive),
        isAll:false,
        isActive:true,
        isCompleted:false,
    });
  },
  showCompleted:function(){
    var allCompleted = [];
    for(var i=0;i!=newData.length;++i){
      if(newData[i].checkData){
        allCompleted.push(newData[i]);
      }else{
        allCompleted.push({inputData:'',checkData:'',istTextChange:'',});
      }
    }
    this.setState({
        dataText: this.state.dataText.cloneWithRows(allCompleted),
        isAll:false,
        isActive:false,
        isCompleted:true,
    });
  },
  checkAll:function(){
    if(!this.state.isCheckAll){
      for(var i=0;i!=newData.length;++i){
         newData[i].checkData = true;
      }
      this.setState({
        isCheckAll: true,
      });
    }else{
      for(var i=0;i!=newData.length;++i){
         newData[i].checkData = false;
      }
      this.setState({
        isCheckAll: false,
      });
    }
    if(this.state.isActive){
      this.showActive();
    }else if(this.state.isCompleted){
      this.showCompleted();
    }else{
      this.setState({
        dataText: this.state.dataText.cloneWithRows(newData),
      });
    }
  },
  _appendEvent: function(index) {
    newData[index].istTextChange = true;
  },
  _onPressOut: function() {
    this.setState({
      dataText: this.state.dataText.cloneWithRows(newData),
    });
  },
  submitChangeLabel: function(index,event){
    if(event.nativeEvent.text != ''){
      newData[index].inputData = event.nativeEvent.text;
      newData[index].istTextChange = false;
      this.setState({
        dataText: this.state.dataText.cloneWithRows(newData),
      });
    }
    this._textInput.focus();
  },
  render: function(){

    //console.log(this.state.dataText);

    var clearData=[];
    for(var c=0;c!=newData.length;++c){
        if(newData[c].checkData){
            clearData.push(newData[c].checkData);
        }
    }
    var clearNum = clearData.length;
    var existNum = newData.length-clearNum;


    var isCheck = [];
    for(var i=0;i!=newData.length;++i){
      if(newData[i].checkData){
        isCheck.push(newData[i].checkData);
      }
    }

    return (

      <View style={styles.container}>
        <Text style={styles.hiStyle}>Todos</Text>
        <View style={styles.InputStyle}>
            <TouchableOpacity onPress={this.checkAll}>
              <View style={styles.checkInput}>
                <Text style={styles.text}>
                {(isCheck.length!=0&&isCheck.length==newData.length) ? '√' : null}
                </Text>
              </View>
            </TouchableOpacity>
            <TextInput ref={component => this._textInput = component}
                       style={styles.textInput} 
                       placeholder='What needs to be done?' 
                       onSubmitEditing={this.submitLabel} />
        </View>
        <View style={styles.ulStyle}>
          <ListView 
            key={this.state.key}
            dataSource={this.state.dataText}
            renderRow={this.renderText}
            style={styles.liStyle} />
        </View>
        {this.state.isBottomDialog ?
          <View style={styles.footer}>
            <View style={styles.footerStyle}>
              <TouchableOpacity onPress={this.showAll} style={styles.selectBtn}>
                <Text style={this.state.isAll?[styles.selectText,styles.active,{width:25,}]:[styles.selectText,{width:25,}]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.showActive} style={styles.selectBtn}>
                <Text style={this.state.isActive?[styles.selectText,styles.active,{width:50,}]:[styles.selectText,{width:50,}]}>Active</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.showCompleted} style={styles.selectBtn}>
                <Text style={this.state.isCompleted?[styles.selectText,styles.active,{width:85,}]:[styles.selectText,{width:85,}]}>Completed</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.footerStyle}>
                <Text style={[styles.foorerText,{width:200,}]}>{existNum+' items left'}</Text>
                <TouchableOpacity onPress={this.clearCheck}>
                  <Text style={styles.foorerText}>{'Clear '+clearNum+' completed'}</Text>
                </TouchableOpacity>
            </View>
          </View>
          :null
        }
      </View>
    );
  },
  renderText: function(textLabel,a,i) {
    console.log(textLabel);
    console.log(textLabel.istTextChange);
    var index = i;
    return (
      <View key={textLabel.inputData}>
      {textLabel.inputData!=''?
        <View style={styles.InputStyle}>
          <TouchableOpacity onPress={this.checkChange.bind(this,index)}>
            <View style={styles.checkInput}>
              <Text style={styles.text}>{textLabel.checkData ? '√' : null}</Text>
            </View>
          </TouchableOpacity>
          {!textLabel.istTextChange ? 
            <TouchableOpacity onLongPress={this._appendEvent.bind(this,index)} onPressOut={this._onPressOut}>
              <View style={styles.labelText}>
                <Text style={styles.text}>{textLabel.inputData}</Text>
              </View>
            </TouchableOpacity>
            :<TextInput style={styles.labelTextInput} 
                       defaultValue={textLabel.inputData} 
                       onSubmitEditing={this.submitChangeLabel.bind(this,index)} />
          }

          <View style={styles.delBtn}>
            <TouchableOpacity onPress={this.delText.bind(this,index)}>
              <Text style={styles.text}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
        :null
      }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    //flex: 1,
    //flexDirection:'row',
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9ECEC',
    paddingTop: 30,
    paddingBottom: 30,
  },
  hiStyle:{
    fontSize:36,
    fontWeight: 'bold',
    textAlign:'center',
  },
  textInput:{
    width: 312,
    height: 30,
    fontSize:24,
    borderWidth:1,
    borderColor:'#999',
  },
  text: {
    fontSize:18,
  },
  liStyle:{
    width: 350,
    position:'relative',
    backgroundColor: '#fff',
  },
  InputStyle:{
    flexDirection:'row',
    margin: 5,
  },
  ulStyle:{
    padding:0,
    alignItems: 'center',
  },
  delBtn:{
    width:20,
    height:20,
  },
  labelText:{
    width:280,
  },
  labelTextInput:{
    width: 280,
    height: 30,
    fontSize:24,
    borderWidth:1,
    borderColor:'#999',
  },
  checkInput:{
    width:22,
    height:22,
    marginRight:15,
    borderRadius:11,
    padding:2,
    borderWidth:1,
    borderColor:'#ccc',
    borderStyle:'solid',
    justifyContent:'center',
    alignItems:'center',
    overflow:'hidden',
  },
  footer:{
    flexDirection:'column',
  },
  footerStyle:{
    width: 350,
    height: 30,
    justifyContent:'center',
    alignItems: 'center',
    flexDirection:'row',
    borderTopWidth:1,
    borderTopColor:'#ccc',
    borderStyle:'solid',
    backgroundColor:'#FFF',
  },
  foorerText:{
    fontSize:14,
  },
  selectText:{
    fontSize:14,
    textAlign:'center',
  },
  active:{
    borderWidth:1,
    borderStyle:'solid',
    borderColor:'red',
  },
  selectBtn:{
    width:100,
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
