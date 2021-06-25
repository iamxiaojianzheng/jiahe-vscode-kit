import * as vscode from 'vscode';
import * as customConfiguration from './config';

export function activate(context: vscode.ExtensionContext) {

  console.log(customConfiguration.default);

  // 可以使用 console.log 和 console.error 输出日志，这段输出只会在插件激活时执行一次
  console.log('Congratulations, your extension "jiahe-vscode-kit" is now active!');

  // getConfiguration() 方法可以获取到当前编辑器的配置项
  const config = vscode.workspace.getConfiguration();

  // globalState.get() 可以获取到设置的全局变量，globalState 可以看成是一个本地数据库
  const updateConfig = context.globalState.get("jiaheKit.updateConfig");

  if (!updateConfig) {
    Object.entries(customConfiguration.default).forEach( async ([key, value]) => {
      // 写入默认的配置项，如果之前存在配置项会进行修改，不存在的配置项会进行新增操作
      await config.update(key, value, 1);
    });
    // 一般与 globalState.get() 成对出现，前者是获取值，globalState.update() 就是设置值
    context.globalState.update("jiaheKit.updateConfig", true);
  }

  // 这里注册的命令要在 package 中 的 contributes.commands 中注册过，且参数必须要跟 package 中的保持一致
  let disposable = vscode.commands.registerCommand(
    "extension.jiaheInitSettings",
    () => {
      // 这里面的内容，每次执行命令时都会执行一次
      const config = vscode.workspace.getConfiguration();
      Object.entries(customConfiguration.default).forEach(([key, value]) => {
        config.update(key, value, 1);
      });
      // 执行成功给个提示
      vscode.window.showInformationMessage("配置项重置成功");
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
