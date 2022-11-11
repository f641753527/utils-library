module.exports = function loader(source) {
  
  const content = source.replace('<template>', '').replace('</template>', '')

  return `export default ${JSON.stringify(content)}`;
}
