import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    
	const provider = new ViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider("menu", provider)
    );
}

// This method is called when your extension is deactivated
export function deactivate() {}


class ViewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'menu';
    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    async resolveWebviewView(webviewView: vscode.WebviewView,context: vscode.WebviewViewResolveContext,_token: vscode.CancellationToken) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = await this.getHtmlForWebview();
    }
	private async getHtmlForWebview(): Promise<string> {
        try {
            const htmlFilePath = vscode.Uri.joinPath(this._extensionUri, 'src/menu.html');
            const htmlContent = await vscode.workspace.fs.readFile(htmlFilePath);
            return htmlContent.toString();
        } catch (error) {
            console.error('Error loading HTML file:', error);
            return 'Error loading HTML file';
        }
    }
}
