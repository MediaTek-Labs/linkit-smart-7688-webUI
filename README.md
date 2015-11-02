# Linkit-smart web UI

This is the web configuration panel and REST api provider you find running on your Linkit smart at http://mylinkit.local/

## Usage

- First, clone the project.

```bash
$ git clone https://github.com/MediaTek-Labs/linkit-smart-7688-webUI.git
```

- Second, open linkit-smart-7688-webUI

``` bash
cd ./linkit-smart-7688-webUI
```

- Copy `/app/build/` folder to linkit smart's path: `/www/`

- Copy three files (`/app/index.html` && `/app/zh-cn.html` && `/app/zh-tw.html`) to linkit smart's path: `/www/`

- Open your browser and type `http://mylinkit.local/` , you will see this webUI!

Done!


## Development

- Env

Confirm your node env is :

```
node: 0.10.28
npm: 2.9.0

```

- First, clone the project.
```bash
$ git clone https://github.com/MediaTek-Labs/linkit-smart-webUI.git
```

- Second, install Dependency.

```
$ npm i
```

- Third, open your command line.

``` bash
$ npm run watch
```

- Open your chrome with --disable-web-security mode.

``` bash
$ open -n -a /Applications/Google\ Chrome.app --args --user-data-dir="/tmp/chrome_dev_session" --disable-web-security
```

and finally go to  `http://127.0.0.1:8081/app`.


## Contribute

1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
5. Push to the branch (git push origin my-new-feature)
6. Create new Pull Request

Hint: Please follow `airbnb` coding style guideline: https://github.com/airbnb/javascript


## Todo

1. Test case
2. Add Makefile config
