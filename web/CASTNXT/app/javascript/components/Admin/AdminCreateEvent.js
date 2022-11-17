import React, {Component} from "react"
import axios from "axios";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

import Header from "../Navbar/Header";
import FormBuilderContainer from "../Forms/FormBuilder.js"
import Slide from "../Forms/Slide.js"
import "./Admin.css";
import "../Forms/Forms.css";

class AdminCreateEvent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tabValue: 0,
            selectedFormNo: "",
            schema: "{}",
            uischema: "{}",
            title: "",
            description: "",
            location: "",
            statename: "",
            eventdate: "",
            category: "",
            formIds: properties.formIds !== undefined ? properties.formIds : [],
            formData: null,
            newFormData: {},
            newFormId: "",
            disableSubmit: false,
            status: "",
            message: ""
            
        }
    }
    
    handleTabChange = (event, newValue) => {
        this.setState({
            tabValue: newValue
        })
      };
    
    handleChange = (e, value) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    
    onFormDataChange = (newFormData) => {
        this.setState({
            newFormData: newFormData.formData
        })
    }
    
    onSchemaChange = (newSchema) => {
        this.setState({
            schema: newSchema
        })
    }
    
    onUISchemaChange = (newUISchema) => {
        this.setState({
            uischema: newUISchema
        })
    }
    
    onFormLoadClick = () => {
        axios.get("/admin/forms/" + this.state.selectedFormNo)
        .then((res) => {
          let parsedData = JSON.parse(res.data.formData.data)
            this.setState({
                formData: parsedData,
                schema: JSON.stringify(parsedData["schema"]),
                uischema: JSON.stringify(parsedData["uischema"])
            })
        })
        .catch((err) => {
            if(err.response.status === 403) {
                window.location.href = err.response.data.redirect_path
            } else {
                window.alert("Error: Could not Load Form " + this.state.selectedFormNo)
            }
        })
    }
    
    onCreateEventClick = () => {
        this.setState({
            disableSubmit: true
        })
      
        axios.post("/admin/forms", {
            data:JSON.stringify({
                schema: JSON.parse(this.state.schema),
                uischema: JSON.parse(this.state.uischema)
            })
        })
        .then((res) => {
            this.setState({
                newFormId: res.data.formId
            })
            
            return axios.post("/admin/events", {
                form_id: this.state.newFormId,
                title: this.state.title,
                description: this.state.description,
                location: this.state.location,
                statename: this.state.statename,
                eventdate: this.state.eventdate,
                category: this.state.category
            })
        })
        .then((res) => {
            this.setState({
                status: true,
                message: res.data.comment
            })
            
            setTimeout(() => {
                window.location.href = "/admin"
            }, 2500)
        })
        .catch((err) => {
            this.setState({
                status: false,
                message: err.response.data.comment,
                disableSubmit: false
            })
            
            if(err.response.status === 403) {
                window.location.href = err.response.data.redirect_path
            }
        })
    }
    
    back = () => {
        window.location.href = "/admin"
    }

    render() {
        
        return(
            <div>
                <div>
                    <Header />
                </div>
                
                <div className="container">
                    <div className="user-events">
                        <h2>Create New Event</h2>
                        <hr style={{ margin: "auto", width: "60%" }} />
                        <br />
                        <Button variant="outlined" onClick={this.back}>Back to Homepage</Button>
                        
                        <br /><br />
                        <div className="container" style={{ backgroundColor: "white", height: "100%", width: "50vw", paddingTop: "1%" }}>
                            <p>Step 1</p>
                            <div className="input-fields">
                              <TextField id="outlined-basic" name="title" label="Event title" variant="outlined" onChange={this.handleChange} value={this.state.title} />
                              <TextField id="outlined-basic" name="description" label="Event description" variant="outlined" onChange={this.handleChange} value={this.state.description} style={{marginTop: "20px", marginBottom: "20px"}}/>
                              <TextField id="outlined-basic" name="location" label="Event location" variant="outlined" onChange={this.handleChange} value={this.state.location} style={{marginTop: "20px", marginBottom: "20px"}}/>
                              <TextField id="outlined-basic" name="statename" label="Event state" variant="outlined" onChange={this.handleChange} value={this.state.statename} style={{marginTop: "20px", marginBottom: "20px"}}/>
                              <TextField id="outlined-basic" name="eventdate" label="Event date" variant="outlined" onChange={this.handleChange} value={this.state.eventdate} style={{marginTop: "20px", marginBottom: "20px"}}/>
                              <TextField id="outlined-basic" name="category" label="Event category" variant="outlined" onChange={this.handleChange} value={this.state.category} style={{marginTop: "20px", marginBottom: "20px"}}/>
                            </div>
                            
                            <br/>
                            
                            <p>Step 2</p>
                            <div>
                                <Tabs variant="fullWidth" value={this.state.tabValue} onChange={this.handleTabChange} centered>
                                    <Tab style={{focus: "color: #719ECE"}} label="Choose Existing Form" />
                                    <Tab label="Create New Form" />
                                </Tabs>
                                <hr style={{ color: "black" }} />
                            </div>
                            
                            
                            {this.state.tabValue === 0 &&
                                <div>
                                    <div className="flex-row">
                                        <div style={{flex:1, marginRight:"10px"}}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Form number</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Form number"
                                                    value={this.state.selectedFormNo}
                                                    onChange={(event)=>{this.setState((state, props) => {
                                                        return {selectedFormNo: event.target.value, formData: null};
                                                    });
                                                    }}
                                                >
                                                    {this.state.formIds.map(formId => {
                                                        return (
                                                            <MenuItem key={formId} value={formId}>Form {formId}</MenuItem>
                                                        )
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </div>
                                        
                                        <Button variant="contained" style={{flex:1}} onClick={this.onFormLoadClick}>Load this form</Button>
                                    </div>
                                    
                                    <br />
                                    
                                    {this.state.selectedFormNo && this.state.formData &&
                                        <div className="form-preview">
                                            <p className="preview-title">Form preview: </p>
                                            <Slide
                                                schema={this.state.formData.schema}
                                                uiSchema={this.state.formData.uiSchema}
                                                formData={{}}
                                                onFormDataChange={() => {}}
                                            />
                                        </div>
                                        
                                    }
                                </div>
                            }

                            {this.state.tabValue === 1 &&
                                <FormBuilderContainer 
                                    schema={this.state.schema}
                                    uischema={this.state.uischema} 
                                    onSchemaChange={this.onSchemaChange}
                                    onUISchemaChange={this.onUISchemaChange}
                                    onFormDataChange={this.onFormDataChange}
                                    formData={this.state.newFormData}
                                />
                            }
                            
                            <br /><br />
                            
                            <Button disabled={this.state.disableSubmit} variant="contained" onClick={this.onCreateEventClick}>Create Event</Button>
                            
                            {(this.state.status !== "" && this.state.status) &&
                                <div>
                                    <br />
                                    <Alert severity="success">{this.state.message}</Alert>
                                    <br />
                                </div>
                            }
                            
                            {(this.state.status !== "" && !this.state.status) &&
                                <div>
                                    <br />
                                    <Alert severity="error">Error: {this.state.message}</Alert>
                                    <br />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminCreateEvent