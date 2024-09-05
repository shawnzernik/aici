import React from "react";
import { DatasetsService } from "../services/DatasetsService";
import { SuggestionsService } from "../services/SuggestionsService";
import { Theme } from "../Theme";
import { Alert } from "../models/Alert";
import { Dictionary } from "../models/Dictionary";
import { Dataset } from "../models/Dataset";
interface Props {
    alert: (alert: Alert) => void;
    loading: (show: boolean) => void;
    shared: Dictionary<string>;
    setSharedAndActive: (dic: Dictionary<string>, active: string) => void;
}

interface State {
    datasets: string[];
    suggestions: string[];
    draggedItem: { type: string; name: string } | null;
}

export class DatasetsPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            datasets: [],
            suggestions: [],
            draggedItem: null
        };
    }

    componentDidMount() {
        this.reload();
    }

    private reload() {
        this.setState({
            datasets: [],
            suggestions: []
        });

        this.props.loading(true);

        let loaded = 0;
        DatasetsService.list()
            .then((ret) => {
                this.setState({ datasets: ret.sort() }, () => {
                    loaded++;
                    if (loaded >= 2)
                        this.props.loading(false);
                });
            })
            .catch((err: Error) => {
                this.props.alert({ title: "Error", message: err.message });
            });
        SuggestionsService.list()
            .then((ret) => {
                this.setState({ suggestions: ret.sort() }, () => {
                    loaded++;
                    if (loaded >= 2)
                        this.props.loading(false);
                });
            }).catch((err: Error) => {
                this.props.alert({ title: "Error", message: err.message });
            });
    }

    private dragStart(event: React.DragEvent<HTMLDivElement>, type: string, name: string) {
        this.setState({ draggedItem: { type, name } });
        event.dataTransfer.effectAllowed = "move";
    }

    private dragOver(event: React.DragEvent<HTMLDivElement>, type: string) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }

    private copyToDatasets(suggestionName: string) {
        this.props.loading(true);

        SuggestionsService.read(suggestionName)
            .then((contents) => {
                return DatasetsService.save(suggestionName, contents);
            })
            .then(() => {
                return SuggestionsService.delete(suggestionName);
            })
            .then(() => {
                this.props.loading(false);
                this.reload();
            })
            .catch((err: Error) => {
                this.props.alert({ title: "Error", message: err.message })
            });
    }
    private async combineSuggestion(target: string, sourceSuggestion: string) {
        try {
            this.props.loading(true);
        
            const targetDs = await DatasetsService.read(target);
            const sourceDs = await SuggestionsService.read(sourceSuggestion);
    
            this.combineDs(sourceDs, targetDs);
    
            await DatasetsService.save(target, targetDs);
            await SuggestionsService.delete(sourceSuggestion);
    
            this.reload();    
        }
        catch(err) {
            this.props.alert({title: "Error", message: (err as Error).message});
        }
    }
    private async combineDatasets(target: string, source: string) {
        const targetDs = await DatasetsService.read(target);
        const sourceDs = await DatasetsService.read(source);

        this.combineDs(sourceDs, targetDs);

        await DatasetsService.save(target, targetDs);
        await DatasetsService.delete(source);
    }
    private combineDs(source: Dataset, target: Dataset) {
        source.lessons.forEach((lesson) => {
            target.lessons.push(lesson);
        });
    }

    private doubleClicked(type: "dataset" | "suggestion", fileName: string) {
        const shared = JSON.parse(JSON.stringify(this.props.shared))
        shared["type"] = type;
        shared["file"] = fileName;
        this.props.setSharedAndActive(shared, "DatasetPage")
    }

    render() {
        const datasetList = this.state.datasets.map((file) => (
            <div
                key={file}
                className="draggable dataset"
                style={Theme.DatasetListChildListItem}
                draggable
                onDragStart={(event) => this.dragStart(event, "dataset", file)}
                onDragOver={(event) => this.dragOver(event, "dataset")}
                onDrop={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const { draggedItem } = this.state;
                    if (draggedItem && draggedItem.type === "dataset")
                        this.combineDatasets(file, draggedItem.name);
                    if (draggedItem && draggedItem.type === "suggestion")
                        this.combineSuggestion(file, draggedItem.name);
                    this.setState({ draggedItem: null });
                }}
                onDoubleClick={() => this.doubleClicked("dataset", file)}
            >
                {file}
            </div>
        ));

        const suggestionList = this.state.suggestions.map((file) => (
            <div
                key={file}
                className="draggable suggestion"
                style={Theme.DatasetListChildListItem}
                draggable
                onDragStart={(event) => this.dragStart(event, "suggestion", file)}
                onDoubleClick={() => this.doubleClicked("suggestion", file)}
            >
                {file}
            </div>
        ));

        return (
            <div style={Theme.Dataset}>
                <div style={Theme.DatasetButtons}>
                    <button style={Theme.Button} onClick={this.reload.bind(this)}>Reload</button>
                </div>
                <div style={Theme.DatasetLists}>
                    <div
                        style={Theme.DatasetListChild}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            const { draggedItem } = this.state;
                            if (draggedItem && draggedItem.type === "suggestion")
                                this.copyToDatasets(draggedItem.name);
                            this.setState({ draggedItem: null });
                        }}
                    >
                        <h1>Datasets</h1>
                        <div style={Theme.DatasetListChildList}>
                            {datasetList}
                        </div>
                    </div>
                    <div style={Theme.DatasetListChild}>
                        <h1>Suggestions</h1>
                        <div style={Theme.DatasetListChildList}>
                            {suggestionList}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}