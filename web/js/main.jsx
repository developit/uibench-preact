import { h, render } from 'preact';
import { Main } from './ui/main';

uibench.init('Preact', '10');

document.addEventListener('DOMContentLoaded', (e) => {
  var container = document.querySelector('#App');

  uibench.run(
      (state) => {
        render(<Main data={state}/>, container);
      },
      (samples) => {
        render(<pre>{JSON.stringify(samples, null, ' ')}</pre>, container);
      }
  );
});
