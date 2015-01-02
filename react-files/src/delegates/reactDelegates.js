
var InputBox = React.createClass({
	changeHandler: function(input) {
		this.props.onFilterChange(					
			this.refs.filterTextInput.getDOMNode().value
			);
	},
	render: function() {
		return (
			<form>
			<input ref="filterTextInput" value={this.props.filterName} onChange={this.changeHandler} type="text" className="form-control" placeholder={this.props.placeHolder}></input>
			</form>
			);
	}
});

var HeaderRow = React.createClass({
	render: function() {
		var props = this.props;
		var headers = this.props.headers;
		var sortIndex = this.props.sortIndex;
		var inverse = this.props.inverse;

		var headerLength=0;
		for (var key in headers) {
			if (headers.hasOwnProperty(key)) {
				headerLength++;
			}
		}

		var clickHandler = function(ev) {
			if (ev.target.cellIndex>=0) {
				props.onSortClick(					
					ev.target.cellIndex	
					);
			}
		};

		/*var sort = [];
		var spanStyle = {
			float: 'left'
		};

		for (var i = 0; i < headerLength; i++) {
			if (i===sortIndex) {
				if (inverse) {
					sort.push(<th className="bold sortable"><span style={spanStyle} key={i} className="glyphicon glyphicon-sort-by-attributes"></span>{headers['accounts.name']}</th>);
				}
				else {
					sort.push(<th className="bold sortable"><span style={spanStyle} key={i} className="glyphicon glyphicon-sort-by-attributes-alt"></span>{headers['accounts.name']}</th>);
				}
			}			
			else {
				sort.push(<th></th>);
			}
		}
		*/
		return (
			<tr onClick={clickHandler}>
			<th className="bold sortable">{headers['delegates.rank']}</th>
			<th className="bold sortable">{headers['delegates.change24']}</th>
			<th className="bold sortable">{headers['delegates.change7']}</th>
			<th className="bold sortable">{headers['accounts.name']}</th>
			<th className="bold sortable">{headers['delegates.votes']}</th>
			<th className="bold sortable">{headers['delegates.produced']}</th>
			<th className="bold sortable">{headers['delegates.missed']}</th>
			<th className="bold sortable">{headers['delegates.rate']}</th>
			<th className="bold sortable">{headers['delegates.latency']}</th>
			<th className="bold sortable">{headers['delegates.feeds']}</th>
			<th className="bold sortable">{headers['delegates.feedFreq']}</th>
			<th className="bold sortable">{headers['delegates.rel']}</th>
			<th className="bold sortable">{headers['delegates.version']}</th>
			</tr>
			);
	}
});

var DelegateRow = React.createClass({
	render: function() {
		var delegate =this.props.data;
		var no_version = this.props.version;
		var tdLatency, tdActiveFeeds, tdUpdateFeeds, tdReliability, tdVersion;

		if (delegate.delegate_info.blocks_produced < 1 || delegate.avgLatency === 'n/a') {
			tdLatency = <td className="success">n/a</td>;
		}
		else if (delegate.avgLatency >=-1.5 && delegate.avgLatency <=1.5) {
			tdLatency = <td className="success">{(Math.round(delegate.avgLatency*100) / 100)+'s'}</td>;
		}
		else if ((delegate.avgLatency > 1.5 && delegate.avgLatency <=3) || (delegate.avgLatency < -1.5 && delegate.avgLatency > - 3)) {
			tdLatency = <td className="warning">{(Math.round(delegate.avgLatency*100) / 100)+'s'}</td>;
		}
		else if (delegate.avgLatency > 3 || delegate.avgLatency < -3 ) {
			tdLatency = <td className="danger">{(Math.round(delegate.avgLatency*100) / 100)+'s'}</td>;
		}

		if (delegate.activeFeeds >=5) {
			tdActiveFeeds = <td className="success">{delegate.activeFeeds}</td>;	
		}
		else if (delegate.activeFeeds <=4 && delegate.activeFeeds>=1) {
			tdActiveFeeds = <td className="warning">{delegate.activeFeeds}</td>;
		}
		else {
			tdActiveFeeds = <td className="danger">{delegate.activeFeeds}</td>;
		}

		if (delegate.updateFreq >=25) {
			tdUpdateFeeds = <td className="success">{delegate.updateFreq}</td>;
		}
		else if (delegate.updateFreq<25 && delegate.updateFreq>=12) {
			tdUpdateFeeds = <td className="warning">{delegate.updateFreq}</td>;
		}
		else {
			tdUpdateFeeds = <td className="danger">{delegate.updateFreq}</td>;
		}

		if (delegate.reliability >=98) {
			tdReliability =	<td className="success">{Math.round(delegate.reliability*100)/100+'%'}</td>;
		}
		else if (delegate.reliability<98 && delegate.reliability>=95) {
			tdReliability =	<td className="info">{Math.round(delegate.reliability*100)/100+'%'}</td>;
		}
		else if (delegate.reliability<95 && delegate.reliability>=90) {
			tdReliability =	<td className="warning">{Math.round(delegate.reliability*100)/100+'%'}</td>;
		}
		else if (delegate.delegate_info.blocks_produced > 0) {
			tdReliability =	<td className="danger">{Math.round(delegate.reliability*100)/100+'%'}</td>;
		}
		else {
			tdReliability =	<td className="success">n/a</td>;
		}

		if (delegate.version === 1) {
			tdVersion = <td className="success">{delegate.public_data.version}</td>;
		}
		else if (delegate.version === 2) {
			tdVersion = <td className="warning">{delegate.public_data.version}</td>;
		}
		else if (delegate.version === 999) {
			tdVersion = <td className="danger">{no_version}</td>;
		}
		else {
			tdVersion = <td className="danger">{delegate.public_data.version}</td>;
		}
		


		return (
			<tr>
			<td>{delegate.rank}</td>
			<td>{delegate.dayChange}</td>
			<td>{delegate.weekChange}</td>
			<td className={delegate.rank <=101 ? 'bold':''}><a href={'delegates/delegate?name='+delegate.name}>{delegate.name}</a></td>
			<td>{delegate.delegate_info.votes_for_percent+'%'}</td>
			<td>{delegate.delegate_info.blocks_produced}</td>
			<td>{delegate.delegate_info.blocks_missed}</td>
			<td>{delegate.delegate_info.pay_rate+'%'}</td>
			{tdLatency}
			{tdActiveFeeds}
			{tdUpdateFeeds}
			{tdReliability}
			{tdVersion}
			</tr>
			);
	}
});

var DelegatesTable = React.createClass({
	getInitialState: function() {
		return {
			sortIndex: 0,
			inverse: false,
			filterName: ''
		};
	},
	handleSortClick: function(index) {
		this.setState({
			sortIndex: index,
			inverse: !this.state.inverse
		});
	},
	onFilterChange: function(filterName) {
		this.setState({
			filterName: filterName
		});
	},
	displayName: 'DelegatesTable',
	render: function() {
		var headers = this.props.headers;
		var filterFields = ['rank','dayChange','weekChange','name','votes_for_percent','blocks_produced',
		'blocks_missed','pay_rate','avgLatency','activeFeeds','updateFreq','reliability','versionIncrement'];
		var inverse = this.state.inverse;
		if (headers && this.props.data) {			
			// var data = this.props.data;
			var data = JSON.parse(this.props.data);
			var sortIndex = this.state.sortIndex;
			var sortField = filterFields[sortIndex];
			var filterName = this.state.filterName;

			var bodyRows = data
			.filter(function(delegate) {
				return (delegate.name.toLowerCase().indexOf(filterName) > -1);
			})
			.sort(function(a,b) {
				if (sortIndex > 3 && sortIndex < 8) {
					a = a['delegate_info'];
					b = b['delegate_info'];
				}
				if (inverse===false) {
					if (a[sortField] > b[sortField]) {
						return 1;
					}
					if (a[sortField] < b[sortField]) {
						return -1;
					}
					return 0;	
				}
				else {
					if (a[sortField] > b[sortField]) {
						return -1;
					}
					if (a[sortField] < b[sortField]) {
						return 1;
					}
					return 0;	
				}

			})
			.map(function(delegate) {

				return (
					<DelegateRow key={delegate.rank} data={delegate} version={headers['delegates.no_version']} />
					);

			});

			var styleLeft = {
				'marginLeft':'0px',
				'marginRight':'0px',
				'float':'none'
			};

			return (
				<div>
				<div style={styleLeft} className="checkbox container col-md-5 col-xs-12">
				<InputBox filterName={filterName} onFilterChange={this.onFilterChange} placeHolder={headers['delegates.filter']}/>
				</div>
				<table className="table table-condensed table-hover table-bordered">
				<thead>
				<HeaderRow onSortClick={this.handleSortClick} headers={headers} sortIndex={sortIndex} inverse={inverse}/>
				</thead>
				<tbody>
				{bodyRows}
				</tbody>
				</table>
				</div>
				);
		}
		else {
			return <div></div>;
		}
	}
});

app.value('DelegatesTable',DelegatesTable);