# Linkit-smart web UI

This is the web configuration panel and REST api provider you find running on your Linkit smart at http://mylinkit.local/

## 


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

- third, open your command line.

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
