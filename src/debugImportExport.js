import * as EssentialsPlugin from '@tweakpane/plugin-essentials'

export class Loop {
  constructor(debug) {
    this.debug = debug
  }

  enable() {
    //TweakPane Import/Export
        let state = null
        debug.addBlade({
        view: 'buttongrid',
        size: [2, 1],
        cells: (x, y) => ({
            title: [
            ['Export', 'Import'],
            ][y][x],
        }),
        label: 'Settings',
        }).on('click', (ev) => {
        console.log(ev.index[0])
        switch (ev.index[0]) {
            case 0:
                state = pane.exportState()
                console.log(state)
                var jsonData = JSON.stringify(state, null, 2)
                function download(content) {
                    var a = document.createElement("a")
                    var file = new Blob([content], { type: 'application/json' });
                    a.href = URL.createObjectURL(file)
                    a.download = 'tweakpane_state.json'
                    a.click()
                }
                download(jsonData)
                break;
            case 1:
                let input = document.getElementById('jsonFileInput')
                input.addEventListener('change', function(event) {
                    const file = event.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            try {
                                const data = JSON.parse(e.target.result);
                                console.log(data);
                                pane.importState(data)
                            } catch (error) {
                                console.error('Error parsing JSON:', error);
                            }
                        };
                        reader.readAsText(file);
                    }
                })
                input.click()
                
                console.log('imported')
                break;
        }
        })

  }

}